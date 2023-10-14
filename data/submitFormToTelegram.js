export const TELEGRAM_BOT_TOKEN = "6149838895:AAFVuMXc8P2QJ4xFELs93LUhU_Ob0hCC7vw";
export const TELEGRAM_CHAT_ID = "-1001968657624";

export const submitFormToTelegram = async (data, chatId, botToken, basket) => {
    console.log('Basket Data:', basket);

    try {
        const productInfo = (basket || []).map(product => `- ${product.title}, Price: ${product.price}, Quantity: ${product.amount}`).join('\n');

        const message = `
        -----------------------
Інформація о замовлені:
- Імя: ${data.firstName}
- Фамілія: ${data.lastName}
- Телефон: ${data.phoneNumber}
- Email: ${data.email}
- Місто: ${data.city}
- Область: ${data.region}
- Район: ${data.district}
- Вулиця: ${data.address}
- Номер нової пошти: ${data.orderNumber}
----------------------
Вибраний товар:
${productInfo}
`;


        const formattedMessage = `<pre>${message}</pre>`;

        if (data.file && data.file.length > 0) {
            const photoArray = Array.from(data.file);

            const mediaGroup = photoArray.map((_, index) => ({
                type: 'photo',
                media: `attach://photo_${index}`,
                caption: index === 0 ? message : undefined,
            }));

            const formData = new FormData();
            formData.append('chat_id', chatId);
            formData.append('media', JSON.stringify(mediaGroup));

            photoArray.forEach((photo, index) => {
                formData.append(`photo_${index}`, photo, `photo_${index}`);
            });

            const photoResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMediaGroup`, {
                method: 'POST',
                body: formData,
            });

            if (!photoResponse.ok) {
                console.error('Error sending photos to Telegram:', photoResponse.statusText);
            } else {
                return { success: true };
            }
        } else {
            const textResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                body: new URLSearchParams({
                    'chat_id': chatId,
                    'text': formattedMessage,
                    'parse_mode': 'html',
                }),
            });

            if (!textResponse.ok) {
                console.error('Error sending text to Telegram:', textResponse.statusText);
            } else {
                return { success: true };
            }
        }

        return { success: false, error: 'Unknown error' };
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        return { success: false, error: 'Unknown error' };
    }
};

