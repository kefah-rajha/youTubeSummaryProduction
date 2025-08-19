export const getTier = async () => {
    try {
        const response = await fetch('/api/tiers', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },

        });

       

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }
 const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating tier:', error);
        throw error;
    }
};