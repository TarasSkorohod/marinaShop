import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import s from '../styles/Basket.module.css';
import MyForm from "../components/Form/Form";

export default function Basket({
                                 basket = [],
                                 setBasket,
                                 setVisibl,
                                 setText,
                                 currency,
                               }) {
  const router = useRouter();

  const addToBasketHandler = (product) => {
    // Add the product to the basket
    setBasket([...basket, product]);

    // Pass the updated basket to MyForm
    const updatedBasket = [...basket, product];
    setVisibl(true);
    setText('Товар доданий у корзину!');
  };

  const clickBasketHandler = (e) => {
    e.stopPropagation();
    setBasket(basket.filter((el) => el.id !== Number(e.target.dataset.id)));
    setText('Товар видалений із корзини!');
    setVisibl(true);
  };

  return (
      <>
        {basket.map((el) => (
            <div
                key={el.id}
                className={s.product}
                onClick={() => router.push(`/product/${el.id}`)}
            >
              <div className={s.productImgTitle}>
                <Image
                    src={el.image}
                    width={200}
                    height={250}
                    alt="Товар"
                    priority
                    style={{ width: 'auto', height: 'auto' }}
                />
                <div className={s.title}>{el.title}</div>
              </div>
              <div
                  className={s.price}
                  onClick={(e) => e.stopPropagation()}
                  style={{ height: '100%', cursor: 'auto' }}
              >
                <div className={s.amountBlock}>
                  {el.amount > 1 ? (
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            el.amount = el.amount - 1;
                            setBasket([...basket]);
                          }}
                      >
                        -
                      </button>
                  ) : (
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            el.amount = el.amount - 1;
                            setBasket([...basket]);
                          }}
                          disabled
                          style={{ cursor: 'not-allowed' }}
                      >
                        -
                      </button>
                  )}
                  <span className={s.amount}>{el.amount}</span>
                  {el.amount < 10 ? (
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            el.amount = el.amount + 1;
                            setBasket([...basket]);
                          }}
                      >
                        +
                      </button>
                  ) : (
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            el.amount = el.amount + 1;
                            setBasket([...basket]);
                          }}
                          disabled
                          style={{ cursor: 'not-allowed' }}
                      >
                        +
                      </button>
                  )}
                </div>

                    <span>{(el.price * el.amount).toFixed(2)} UAH</span>
                <button
                    className="btn remove"
                    onClick={clickBasketHandler}
                    style={{ marginTop: 0 }}
                    data-id={el.id}
                >
                  Видалити
                </button>
              </div>
            </div>
        ))}
        <div className={s.summ}>
        <span>
          Всього товарів:{' '}
          {basket.map((el) => el.amount).reduce((acc, sum) => acc + sum, 0)} штук.
        </span>
            <span>
                Всі:{' '}
                {basket
                    .map((el) => el.price* el.amount)
                    .reduce((acc, sum) => acc + sum, 0)
                    .toFixed(2)}{' '}
                UAH
          </span>

        </div>
        <div>
          <Link className="btn normal" href={'/'}>
            Давай йди купляти!
          </Link>
          <Link
              className="btn success"
              href={'/payment'}
              style={{ marginLeft: '10px' }}
          >
            До оплати
          </Link>
        </div>
      </>
  );
}
