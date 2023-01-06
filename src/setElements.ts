export const setElementHtml = (target: string, text = '') => {
  const element = document.querySelector(target);
  if (element) {
    element.innerHTML = text;
  }
};

export const setElementValue = (target: string, value = '') => {
  const element = document.querySelector(target) as HTMLInputElement;
  element.value = value;
};

export const getElementValue = (target: string): string => {
  const element = document.querySelector(target) as HTMLInputElement;
  return element.value;
};

export const showElement = (target: string) => {
  const element = document.querySelector(target);
  if (element) {
    element.classList.add('active');
  }
};

export const hideElement = (target: string) => {
  const element = document.querySelector(target);
  if (element) {
    element.classList.remove('active');
  }
};

export const formatDate = (target: string) => {
  const date = new Date(target);
  const year = String(date.getFullYear()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const today = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${today} | ${hour}:${min}`;
};

// 토스트 메시지 출력
export function showToast(text = '에러가 발생하였습니다.') {
  setElementHtml('.toast', text);
  showElement('.toast');
  const toastEl = document.querySelector('.toast') as HTMLElement;
  toastEl.addEventListener(
    'animationend',
    () => {
      hideElement('.toast');
    },
    false
  );
}
