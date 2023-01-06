import { curOrder, fnReorderTodo, renderTodoList } from './renderTodo';
import { deleteListTodo, insertTodo } from './requests';
import {
  showElement,
  hideElement,
  showToast,
  setElementValue,
  getElementValue,
} from './setElements';

const addInputEl = document.querySelector('.add-input') as HTMLInputElement;
addInputEl.focus();

const memoData = localStorage.getItem('memo');
if (memoData) {
  setElementValue('.memo-txa', memoData);
}

// TODO 목록 조회
showElement('.loading');
setTimeout(async () => {
  renderTodoList();
  hideElement('.loading');
}, 1000);

// TODO 추가 버튼 클릭 이벤트
const addBtnEl = document.querySelector('.add-btn') as HTMLButtonElement;
addBtnEl.addEventListener('click', async () => {
  const title = getElementValue('.add-input').trim();
  if (title.length === 0) {
    alert('할 일을 입력해 주세요.');
    return;
  }
  showElement('.loading');
  await insertTodo(title, curOrder);
  renderTodoList();
  hideElement('.loading');
  setElementValue('.add-input');
  showToast('추가가 완료되었습니다.');
});

// TODO 추가 input 엔터키 이벤트
addInputEl.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.isComposing) {
    addBtnEl.click();
  }
});

// 체크된 TODO 삭제 버튼 클릭 이벤트
const checkedDeleteBtnEl = document.querySelector('.checked-delete-btn') as HTMLButtonElement;
checkedDeleteBtnEl.addEventListener('click', async (event) => {
  if (!confirm('완료된 할 일을 모두 삭제하시겠어요?')) return;
  let checkeds = document.querySelectorAll('.todo-done:checked');
  checkeds = Array.from(checkeds).map((item) => item.parentElement.dataset.id);

  if (checkeds.length === 0) {
    alert('완료된 할 일이 없습니다.');
    return;
  }
  checkeds.forEach((item) => {
    const todosEl = document.querySelector('.todos') as HTMLUListElement;
    const todoEl = document.querySelector(`[data-id="${item}"]`) as HTMLLIElement;
    todosEl.removeChild(todoEl);
  });
  showElement('.loading');
  await deleteListTodo(checkeds);
  await fnReorderTodo();
  renderTodoList();
  hideElement('.loading');
  showToast('삭제가 완료되었습니다.');
});

// 보기 selectBox 변경 이벤트
const typeEl = document.querySelector('.type') as HTMLSelectElement;
typeEl.addEventListener('change', () => {
  showElement('.loading');
  renderTodoList(getElementValue('.type'), getElementValue('.order'));
  hideElement('.loading');
});

// 정렬 selectBox 변경 이벤트
const orderEl = document.querySelector('.order') as HTMLSelectElement;
orderEl.addEventListener('change', () => {
  showElement('.loading');
  renderTodoList(getElementValue('.type'), getElementValue('.order'));
  hideElement('.loading');
});

// MEMO 변경 이벤트
const memoTextareaEl = document.querySelector('.memo-txa') as HTMLTextAreaElement;
memoTextareaEl.addEventListener('change', () => {
  showElement('.loading');
  localStorage.setItem('memo', getElementValue('.memo-txa'));
  hideElement('.loading');
  showToast('메모가 저장되었습니다.');
});
