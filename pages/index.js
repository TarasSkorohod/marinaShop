import Image from 'next/image';
import s from '../styles/Catalog.module.css';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Loading } from '../components/Loading';
import { useRouter } from 'next/router';
import { MySelect } from '../components/MySelect';
import VanillaTilt from 'vanilla-tilt';
import { projectsData } from "../data/data";

export default function Catalog({
                                  projectsData: serverData,
                                  basket,
                                  setBasket,
                                  setVisibl,
                                  setText,
                                  currency,
                                  category,
                                  setCategory,
                                  sort,
                                  setSort,
                                }) {
  const [data, setData] = useState(projectsData);
  const [products, setProducts] = useState(data);
  const [value, setValue] = useState('');

  const router = useRouter();

  const clickBasketHandler = (e) => {
    e.stopPropagation();

    if (e.target.innerHTML === 'Видалити') {
      setBasket(basket.filter((el) => el.id !== Number(e.target.dataset.id)));
      setText('Товар видалений с кошика!');
      setVisibl(true);
    } else {
      const product = products.find(
          (el) => el.id === Number(e.target.dataset.id)
      );
      product.amount = 1;
      setBasket([...basket, product]);
      setText('Товар доданий до кошика!');
      setVisibl(true);
    }
  };

  const searchChangeHandler = (e) => {
    setValue(e.target.value);
  };

  const sortingHelper = (arr = [], option) => {
    if (option === 'за зростанню') {
      return arr.sort((a, b) => a.price - b.price);
    } else if (option === 'за зменшенням') {
      return arr.sort((a, b) => b.price - a.price);
    } else return arr.sort((a, b) => a.id - b.id);
  };

  useEffect(() => {
    if (document.documentElement.clientWidth > 900) {
      const listElement =
          document && document.querySelectorAll(`[data-el='card']`);
      VanillaTilt.init(listElement);
    }
  }, [products]);

    useEffect(() => {
        if (serverData) {
            const product = serverData.find((item) => item.id === parseInt(router.query.id));
            setData(product || null);
        } else {
            setData(projectsData || null);
        }
    }, [serverData, router]);

  useLayoutEffect(() => {
    if (category === 'Всі' && data) {
      setProducts(
          sortingHelper(
              data.filter((el) =>
                  el.title.toLowerCase().includes(value.toLowerCase())
              ),
              sort
          )
      );
    } else
      setProducts(
          data &&
          sortingHelper(
              data
                  .filter((el) => el.category === category)
                  .filter((el) =>
                      el.title.toLowerCase().includes(value.toLowerCase())
                  ),
              sort
          )
      );
  }, [category, data, value, sort]);

  if (!data) {
    return (
        <>
          <Loading />
        </>
    );
  }

  return (
      <div className={s.container}>
        <div className={s.filter}>
          <div>
            <input
                placeholder="Пошук ..."
                value={value}
                onChange={searchChangeHandler}
            ></input>
          </div>
          <div className={s.filterGroupItem}>
            <div className={s.filterItem}>
              <span>Сортувати ціні: </span>
              <MySelect
                  value={sort}
                  setValue={setSort}
                  dataList={['за зростанню', 'за зменшенням', 'без сортування']}
              />
            </div>
            <div className={s.filterItem}>
              <span>Категория: </span>
              <MySelect
                  value={category}
                  setValue={setCategory}
                  dataList={[
                    'Всі',
                    `Чоловічі`,
                    `Жіночі`,
                  ]}
              />
            </div>
          </div>
        </div>
        <div className={s.catalog}>
          {products.length !== 0 ? (
              products.map((el) => (
                  <div
                      key={el.id} // Ensure that the key is unique
                      data-el="card"
                      className={s.card}
                      onClick={() => router.push(`./product/${el.id}`)}
                  >
                    <div className={s.title}>{el.title}</div>
                    <div
                        style={{
                          height: '221px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                    >
                      <Image
                          src={el.image}
                          alt=""
                          width={100}
                          height={100}
                          priority
                      />
                    </div>
                    <div style={{ marginTop: '20px' }}>

                          <div className={s.price}>
                            {(el.price).toFixed(2)} грн
                          </div>

                      {basket.find((a) => a.id === el.id) ? (
                          <button
                              className="btn remove"
                              onClick={clickBasketHandler}
                              data-id={el.id}
                          >
                            Видалити
                          </button>
                      ) : (
                          <button
                              className="btn success"
                              onClick={clickBasketHandler}
                              data-id={el.id}
                          >
                            Додати
                          </button>
                      )}
                    </div>
                  </div>
              ))
          ) : (
              <div>Нічого не знайдено ...</div>
          )}
        </div>
      </div>
  );
}


