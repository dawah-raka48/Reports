/* ==========================================
   API Service
========================================== */

class ApiService {

    static async request(action, data = {}) {

        try {

            const body = new URLSearchParams();

            body.append("action", action);

            Object.keys(data).forEach(key => {

                body.append(key, data[key]);

            });

            const response = await fetch(CONFIG.API_URL, {

                method: "POST",

                body: body

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
