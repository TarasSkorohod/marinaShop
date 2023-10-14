import { useState, useEffect } from 'react';
import styles from '../../styles/MyForm.module.css';
import {
    submitFormToTelegram,
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID,
} from '../../data/submitFormToTelegram';

const citiesUkraine = {
    'Вінницька': ['Вінниця', 'Жмеринка', 'Козятин'],
    'Волинська': ['Луцьк', 'Нововолинськ', 'Ковель'],
    'Дніпропетровська': ['Дніпро', 'Кривий Ріг', 'Кам\'янське'],
    'Донецька': ['Донецьк', 'Макіївка', 'Маріуполь'],
    'Житомирська': ['Житомир', 'Новоград-Волинський', 'Малин'],
    'Закарпатська': ['Ужгород', 'Мукачево', 'Хуст'],
    'Запорізька': ['Запоріжжя', 'Мелітополь', 'Бердянськ'],
    'Івано-Франківська': ['Івано-Франківськ', 'Коломия', 'Калуш'],
    'Київ': ['Київ'],
    'Кіровоградська': ['Кіровоград', 'Олександрія', 'Світловодськ'],
    'Луганська': ['Луганськ', 'Алчевськ', 'Лисичанськ'],
    'Львівська': ['Львів', 'Дрогобич', 'Самбір'],
    'Миколаївська': ['Миколаїв', 'Южноукраїнськ', 'Первомайськ'],
    'Одеська': ['Одеса', 'Іллічівськ', 'Южне'],
    'Полтавська': ['Полтава', 'Кременчук', 'Миргород'],
    'Рівненська': ['Рівне', 'Дубно', 'Острог'],
    'Сумська': ['Суми', 'Охтирка', 'Конотоп'],
    'Тернопільська': ['Тернопіль', 'Чортків', 'Бережани'],
    'Харківська': ['Харків', 'Ізюм', 'Балаклія'],
    'Херсонська': ['Херсон', 'Нова Каховка', 'Скадовськ'],
    'Хмельницька': ['Хмельницький', 'Кам\'янець-Подільський', 'Шепетівка'],
    'Черкаська': ['Черкаси', 'Канів', 'Умань'],
    'Чернівецька': ['Чернівці', 'Чернівці', 'Новоселиця'],
    'Чернігівська': ['Чернігів', 'Ніжин', 'Прилуки'],
};



const regionsUkraine = [
    'Вінницька',
    'Волинська',
    'Дніпропетровська',
    'Донецька',
    'Житомирська',
    'Закарпатська',
    'Запорізька',
    'Івано-Франківська',
    'Київ',
    'Кіровоградська',
    'Луганська',
    'Львівська',
    'Миколаївська',
    'Одеська',
    'Полтавська',
    'Рівненська',
    'Сумська',
    'Тернопільська',
    'Харківська',
    'Херсонська',
    'Хмельницька',
    'Черкаська',
    'Чернівецька',
    'Чернігівська',
];

export default function MyForm({ basket }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
        orderNumber: '',
        district: '',
        region: '',
        address: '',
    });

    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setTotalPrice(calculateTotalPrice(basket));
    }, [basket]);

    useEffect(() => {
        // Валідація форми: перевірте, чи всі поля заповнені
        const isValid = Object.values(formData).every(value => value.trim() !== '');
        setIsFormValid(isValid);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Перевірте, чи є товари в кошику перед відправленням форми
        if (basket.length === 0) {
            setSubmitSuccess(false);
            setSubmitError('Додайте товари до кошика перед відправленням замовлення.');
            return;
        }

        setLoading(true);

        const productsInfo = basket.map((product) => `- ${product.title}, Ціна: ${product.price}, Кількість: ${product.amount}`).join('\n');

        const additionalInfo = `
            Загальна інформація про замовлення:
            ${productsInfo}

            Загальна вартість: ${totalPrice} ${getCurrencySymbol()}
        `;

        const telegramData = {
            ...formData,
            productsInfo,
            additionalInfo,
            basket,
        };

        const telegramResponse = await submitFormToTelegram(
            telegramData,
            TELEGRAM_CHAT_ID,
            TELEGRAM_BOT_TOKEN,
            basket
        );

        setLoading(false);

        if (telegramResponse.success) {
            setSubmitSuccess(true);
            setSubmitError('');
            console.log('Дані форми та кошик успішно відправлені в Telegram!');
        } else {
            setSubmitSuccess(false);
            setSubmitError(`Помилка: ${telegramResponse.error}`);
            console.error('Помилка відправлення даних форми та кошика в Telegram:', telegramResponse.error);
        }
    };

    const calculateTotalPrice = (basket) => {
        return basket.reduce((total, product) => total + product.price * product.amount, 0).toFixed(2);
    };

    const getCurrencySymbol = () => {
        return 'UAH';
    };

    return (
        <div className="flex flex-col items-center justify-center">

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className="flex space-x-4">
                    <label className={styles.label}>
                        Імя:
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </label>
                    <label className={styles.label}>
                        Прізвище:
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </label>
                </div>
                <br />
                <label className={styles.label}>
                    Електронна пошта:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>
                <br />
                <label className={styles.label}>
                    Номер телефону:
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>
                <br />
                <label className={styles.label}>
                    Місто:
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    >
                        <option value="" disabled hidden>Оберіть місто</option>
                        {Object.keys(citiesUkraine).map((region) => (
                            citiesUkraine[region].map((city, index) => (
                                <option key={`${region}-${index}`} value={city}>{city}</option>
                            ))
                        ))}
                    </select>
                </label>

                <br />
                <label className={styles.label}>
                    Область:
                    <select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    >
                        <option value="" disabled hidden>Оберіть область</option>
                        {regionsUkraine.map((region) => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </label>
                <br />
                <label className={styles.label}>
                    Номер Нової Пошти:
                    <input
                        type="text"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>
                <br />
                <label className={styles.label}>
                    Район:
                    <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>
                <br />

                <label className={styles.label}>
                    Адреса:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>
                <br />
                <p>Загальна вартість: {totalPrice} {getCurrencySymbol()}</p>
                <button   className="btn success" type="submit"  disabled={loading || !isFormValid}>
                    {loading ? 'Відправка...' : 'Відправити'}
                </button>

                {submitError && <p className={styles.error}>{submitError}</p>}
                {submitSuccess && (
                    <p className={styles.success}>Форма успішно відправлена!</p>
                )}
            </form>
        </div>
    );
}
