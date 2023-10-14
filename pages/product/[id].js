// Import necessary modules
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Loading } from '../../components/Loading';
import s from '../../styles/Product.module.css';
import {projectsData} from "../../data/data";

// Product component
export default function Product({
                                  projectsData: serverData,
                                  basket,
                                  setBasket,
                                  setVisibl,
                                  setText,
                                  currency,
                                  setCategory,
                                }) {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (projectsData) {
      const product = projectsData.find((item) => item.id === parseInt(router.query.id));
      setData(product || null);
    }
  }, [serverData, router]);

  if (!data) {
    return <Loading />;
  }

  const clickBasketHandler = (e) => {
    if (e.target.innerHTML === 'Видалити') {
      setBasket(basket.filter((el) => el.id !== Number(e.target.dataset.id)));
      setText('Товар видалений с кошика!');
      setVisibl(true);
    } else {
      const productToAdd = { ...data, amount: 1 };
      setBasket([...basket, productToAdd]);
      setText('Товар доданий в кошика!');
      setVisibl(true);
    }
  };

  const categoryClickHandler = (e) => {
    setCategory(e.target.innerHTML);
    router.push('/');
  };

  return (
      <>
        <div className={s.title}>{data.title}</div>
        <div className={s.content}>
          <Image
              src={data.image}
              width={200}
              height={250}
              alt="Товар"
              priority
              style={{ width: 'auto', height: 'auto' }}
          />
          <div>
            <div className={s.description}><span className={s.bold}>Опис аромату: </span>{data.scent}</div>

            <div className={s.description}><span className={s.bold}>Тип аромату:</span> {data.type}</div>
            <div className={s.description}> <span className={s.bold}>Об`єм:</span>{data.volume}</div>
            <div className={s.description}><span className={s.bold}>Країна виробник:</span> {data.country}</div>

            <div className={s.blockList}>

              <div className={s.list}>
                <span>Категория:</span>
                <span
                    className={s.bold}
                    style={{ cursor: 'pointer' }}
                    onClick={categoryClickHandler}
                >
                {data.category}
              </span>
              </div>
              <div className={s.list}>
                <span>Рейтинг:</span>
                <span
                    className={s.rating}
                    style={{ '--rating': data.rating.rate }}
                    aria-label={`Rating of this product is ${data.rating.rate} out of 5.`}
                ></span>
              </div>
              <div className={s.list}>
                <span>Ціна:</span>

                    <span className={s.bold}>
                  {(data.price).toFixed(2)} UAH
                </span>

              </div>
              <div className={s.blockBtn}>
                {basket.find((a) => a.id === data.id) ? (
                    <button
                        className="btn remove"
                        onClick={clickBasketHandler}
                        data-id={data.id}
                    >
                      Видалити
                    </button>
                ) : (
                    <button
                        className="btn success"
                        onClick={clickBasketHandler}
                        data-id={data.id}
                    >
                      Додати
                    </button>
                )}
                <Link
                    href={'/'}
                    className="btn normal"
                    style={{ marginLeft: '10px' }}
                >
                  До каталогу
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}
