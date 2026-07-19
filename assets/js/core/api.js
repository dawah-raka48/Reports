/* ==========================================
   API Service
========================================== */

class ApiService {

    static async request(action, data = {}) {

        try {

            const response = await fetch(CONFIG.API_URL, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    action,

                    ...data

                })

            });

            return await response.json();

        }

        catch (error) {

            console.error(error);

            return {

                success: false,

                message: "Network Error"

            };

        }

    }

}
