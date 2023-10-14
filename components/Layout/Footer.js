import s from '../../styles/Layout.module.css';
import { useRouter } from 'next/router';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export const Footer = ({ category, setCategory }) => {
  const router = useRouter();

  const defaultState = {
    center: [53.917846, 27.589149],
    zoom: 13,
  };

  const clickCategory = (e) => {
    if (router.pathname !== '/') {
      router.push('/');
    }
    if (e.target.localName === 'li') {
      setCategory(e.target.innerHTML);
      window.scroll(0, 0);
    }
  };

  return (
    <div className={s.footer}>
      <div className={s.contactsBlock}>
        <div>
          <span>Категорія:</span>
          <ul onClick={clickCategory}>
            <li>{`Чоловічі`}</li>
            <li>{`Жіночі`}</li>
          </ul>
        </div>
        <div className={s.contacts}>
          <div>
            <span>Контакты:</span>
            <ul>
              <li>+38095-654-99-92</li>
              <li>+38095-654-99-92</li>
              <li>taras@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>
      <div className={s.copy}>
        2022-2023© Інтернет магазин. Всі права захищені.
      </div>
    </div>
  );
};
