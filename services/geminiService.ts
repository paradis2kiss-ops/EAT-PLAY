import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe, ModifiedRecipe, AiMealPlan } from '../types';

interface AiRequestContext {
    disease: string;
    avoidance: string;
    query?: string;
    period?: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function getAiIngredientModification(diseaseName: string, recipe: Recipe): Promise<ModifiedRecipe> {
    const prompt = `
      You are a clinical nutritionist and health expert.
      Your task is to modify a recipe for a user with a specific health condition: "${diseaseName}".

      Here is the original recipe:
      - Name: ${recipe.name}
      - Ingredients: ${recipe.ingredients.join(', ')}
      - Description: ${recipe.description}

      Please modify the ingredients to make it healthier and more suitable for someone with "${diseaseName}".
      For example, for Kidney Disease, you should suggest reducing sodium (salt, mayonnaise) and potassium (some vegetables).
      Explain the nutritional and medical reasons for your changes in Korean.

      Your response MUST be a valid JSON object in the specified format, enclosed in a single-element array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The original recipe name." },
                            modifiedIngredients: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "List of modified ingredients, with changes specified in parentheses. e.g., '마요네즈 (저나트륨 그릭요거트로 대체)'"
                            },
                            modifiedDescription: { type: Type.STRING, description: "Optional: A new, brief description for the modified recipe in Korean." },
                            reason: { type: Type.STRING, description: "The nutritional/medical reason for the modifications, in Korean." }
                        },
                        required: ["name", "modifiedIngredients", "reason"]
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (Array.isArray(result) && result.length > 0) {
            return result[0];
        } else {
            throw new Error("response was not in the expected format.");
        }
    } catch (error) {
        console.error("Error fetching AI ingredient modifications:", error);
        throw new Error("Failed to get ingredient modifications from AI.");
    }
}

export async function generateAiRecipes(context: AiRequestContext): Promise<ModifiedRecipe[]> {
    const systemInstruction = `당신은 사용자의 '검색 의도'와 '건강 조건'을 최우선으로 존중하는 레시피 생성 및 재료 대체 전문가입니다. 제공되는 '예시'와 '제약 조건'을 통해 정확한 동작 패턴을 학습하고 준수해야 합니다.`;
    
    const userPrompt = `#### [실제 요청 데이터]

현재 사용자의 건강 상태, 알레르기/기피 식품, 그리고 레시피 검색 요청은 다음과 같습니다.

* **1. 사용자 건강 상태:** ${context.disease}
* **2. 알레르기/기피 식품:** ${context.avoidance}
* **3. 음식 검색어:** ${context.query}

#### [최종 요청 사항]

**검색어(${context.query})**에 대한 **최소 5가지 버전의 레시피**를 생성해 주세요.

**🚨 [필수 제약 조건]:**
1.  **반드시 검색어(${context.query})와 관련된 음식**이어야 합니다. 완전히 다른 음식(예: 요거트, 샐러드) 생성은 엄격히 금지됩니다.
2.  **알레르기/기피 식품(${context.avoidance})**은 **어떤 형태로든 레시피에 포함되어서는 안 됩니다.** 만약 ${context.avoidance}가 '없음'이 아니라면, 이를 배제한 이유를 'reason' 필드에 간략히 언급해야 합니다.
3.  생성된 모든 레시피는 질환/건강 유형(${context.disease})에 맞게 재료가 수정되어야 합니다.

#### [출력 형식]
1.  **생성된 레시피 데이터**를 아래의 \`JSON 배열\` 형식으로 정확하게 출력해 주세요.
2.  모든 레시피는 수정된 재료(\`modifiedIngredients\`), **5단계 이상의 상세 조리 과정**(\`instructions\`), 그리고 **추천 이유 및 알레르기 배제 근거**(\`reason\`)를 포함해야 합니다.

Your response MUST be a valid JSON array containing at least 5 recipe objects in the specified format.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The generated healthy recipe name. e.g. '[건강 맞춤] 짜장'" },
                            modifiedIngredients: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "List of modified/alternative ingredients for the dish. e.g., '춘장 (저염 제품 또는 간장 베이스 사용)'"
                            },
                            instructions: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING },
                                description: "Step-by-step cooking instructions for the recipe (at least 5 steps)."
                            },
                            modifiedDescription: { type: Type.STRING, description: "A new, brief description for the generated healthy recipe in Korean." },
                            reason: { type: Type.STRING, description: "The nutritional/medical reason for the ingredient changes and how avoidance foods were excluded, in Korean." }
                        },
                        required: ["name", "modifiedIngredients", "instructions", "reason"]
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (Array.isArray(result) && result.length > 0) {
            return result;
        } else {
            throw new Error("AI response was not in the expected format.");
        }
    } catch (error) {
        console.error("Error fetching AI generated recipe:", error);
        throw new Error("Failed to generate a healthy recipe from AI.");
    }
}

export async function generateAiMealPlan(context: AiRequestContext): Promise<AiMealPlan> {
    const systemInstruction = `당신은 사용자의 건강 상태와 식이 제한 사항을 바탕으로 맞춤형 식단표를 생성하는 전문 영양사입니다. 사용자의 요청을 정확히 분석하여 체계적이고 영양학적으로 균형 잡힌 식단을 제공해야 합니다.`;
    
    const userPrompt = `#### [입력 데이터]

사용자가 식단표 생성을 요청했습니다.

* **1. 사용자 건강 상태:** ${context.disease}
* **2. 알레르기/기피 식품:** ${context.avoidance}
* **3. 요청 기간:** ${context.period === 'week' ? '1주일' : '1달'}

#### [요청 사항]

위의 건강 상태와 요청 기간(${context.period})에 맞는 요일별, 끼니별 상세 식단표를 생성하여 JSON 형식으로 반환해 주세요.

**🚨 [필수 제약 조건]:**
1.  **건강 상태가 '일반 건강식'이고, 알레르기/기피 식품이 빈칸일 경우,** 특정 질환 제약 없이 **한국인이 선호하는 균형 잡힌 웰빙/다이어트 식단**을 구성해야 합니다. (이것이 아무 것도 선택하지 않았을 때의 목표입니다.)
2.  알레르기/기피 식품은 식단표에 포함되어서는 안 됩니다.
3.  식단표 목표: 기간 내 영양 균형과 체중 관리에 도움이 되는 메뉴를 제공해야 합니다.

#### [출력 형식 (JSON)]
Your response MUST be a valid JSON object in the specified format.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "e.g., '[신장 질환 맞춤] 1주일 식단표'" },
                        reason: { type: Type.STRING, description: "The overall principle of this meal plan." },
                        plan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING, description: "e.g., '월요일'" },
                                    meals: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                time: { type: Type.STRING, description: "e.g., '아침', '점심', '저녁'" },
                                                menu: { type: Type.STRING, description: "e.g., '귀리죽과 저염 간장 소스'" },
                                                note: { type: Type.STRING, description: "Nutritional reason for the menu choice." }
                                            },
                                            required: ["time", "menu", "note"]
                                        }
                                    }
                                },
                                required: ["day", "meals"]
                            }
                        }
                    },
                    required: ["title", "reason", "plan"]
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error fetching AI generated meal plan:", error);
        throw new Error("Failed to generate a meal plan from AI.");
    }
}