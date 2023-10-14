import Image from 'next/image';
import Link from 'next/link';
import basketLogo from '../../public/basket.png';
import s from '../../styles/Layout.module.css';
import { MySelect } from '../MySelect';

export const Navigation = ({
  currency,
  setCurrency,
  setText,
  setVisibl,
  basket,
}) => {
  return (
    <nav className={s.navigation}>
      <div className={s.catalogLink}>
        <Link href={'/'} className={s.active}>
          Каталог товару
        </Link>
      </div>
      <span className={s.nameShop}>Сайт Маріна</span>
      <Link href={'/basket'}>
        <div className={s.basket}>
          {basket.length !== 0 && (
            <span className={s.count}>
              {basket.map((el) => el.amount).reduce((acc, sum) => acc + sum, 0)}
            </span>
          )}
          Мій кошик
          <Image src={basketLogo} alt="Кошик" width={30} height={30} />
        </div>
      </Link>
    </nav>
  );
};
