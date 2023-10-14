import { useRouter } from 'next/router';
import Image from 'next/image';
import s from '../styles/Payment.module.css';
import chip from '../public/chip.png';
import visa from '../public/visa.png';
import { useState } from 'react';
import MyForm from "../components/Form/Form";
import Basket from "./basket";

export default function Payment({
  setVisibl,
  setText,
  setBasket,
  basket,
  currency,
}) {
  const router = useRouter();
  const [data, setData] = useState({
    num1: '',
    num2: '',
    num3: '',
    num4: '',
    month: '',
    year: '',
    name: '',
    CVC: '',
  });

  const handlerPayment = (e) => {
    e.preventDefault();
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const element = data[key];
        if (
          ((key === 'num1' ||
            key === 'num2' ||
            key === 'num3' ||
            key === 'num4') &&
            element.length < 4) ||
          ((key === 'month' || key === 'year') && element.length < 2) ||
          (key === 'CVC' && element.length < 3) ||
          element.length === 0
        ) {
          const inp = document.getElementById(key);
          inp.classList.add(s.error);
          inp.focus();
          return;
        }
      }
    }
    router.push(`/`);
    setText('Успішний!');
    setVisibl(true);
    setBasket([]);
  };

  const jump = (e) => {
    e.target.classList.contains(s.error) && e.target.classList.remove(s.error);

    const regex1 = /[^0-9]/;
    const regexEng = /[^A-Za-z ]/;

    if (e.target.id !== 'name') {
      e.target.value = e.target.value.replace(regex1, '');
    } else {
      e.target.value = e.target.value.replace(regexEng, '');
    }
    data[e.target.id] = e.target.value;
    setData({ ...data });

    if (e.target.value.length === 4 && e.target.id !== 'num4') {
      e.target.nextSibling.focus();
    }
    if (e.target.value.length === 4 && e.target.id === 'num4') {
      e.target.parentNode.nextSibling.lastChild.firstChild.focus();
    }
    if (e.target.value.length === 2 && e.target.id === 'month') {
      e.target.nextSibling.nextSibling.focus();
    }
    if (e.target.value.length === 2 && e.target.id === 'year') {
      e.target.parentNode.parentNode.nextSibling.firstChild.focus();
    }
    if (e.target.value.length === 3 && e.target.id === 'CVC') {
      e.target.parentNode.nextSibling.lastChild.focus();
    }
  };

  return (
    <div className={s.payment}>
    <div>
          <span className={s.textTotal}>
            До Оплати:{' '}
            {basket
              .map((el) => el.price * el.amount)
              .reduce((acc, sum) => acc + sum, 0)
              .toFixed(2)}{' '}
            грн
          </span>


      <MyForm basket={basket} />

    </div></div>
  );
}
