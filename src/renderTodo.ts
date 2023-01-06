import { deleteTodo, reorderTodo, getListTodo, updateTodo, dataType } from './requests';
import { formatDate, hideElement, setElementHtml, showElement, showToast } from './setElements';
import Sortable from 'sortablejs';

export let curOrder = 0;
let sortFlag = true;

const renderTodo = (data: dataType) => {
  const todoItemEl = document.createElement('div');
  todoItemEl.className = 'todo-item';
  todoItemEl.dataset.id = data.id;
  todoItemEl.dataset.order = data.order;

  const orderHandleEl = document.createElement('span');
  orderHandleEl.className = 'order-handle';
  orderHandleEl.innerHTML = ':::';

  const checkboxEl = document.createElement('input');
  checkboxEl.className = 'todo-done';
  checkboxEl.type = 'checkbox';
  if (data.done) checkboxEl.checked = true;

  const inputEl = document.createElement('input');
  inputEl.className = 'todo-input';
  inputEl.type = 'text';
  inputEl.value = data.title;

  const dateEl = document.createElement('div');
  dateEl.className = 'date';
  const insertDateEl = document.createElement('span');
  insertDateEl.className = 'insert-date';
  if (data.createdAt) {
    insertDateEl.innerHTML = `Add : ${formatDate(data.createdAt)}`;
  }
  const updateDateEl = document.createElement('span');
  updateDateEl.className = 'update-date';
  if (data.updatedAt) {
    updateDateEl.innerHTML = `Update : ${formatDate(data.updatedAt)}`;
  }
  dateEl.append(insertDateEl, updateDateEl);

  const deleteBtnEl = document.createElement('button');
  deleteBtnEl.className = 'delete-btn';
  const deleteIconEl = document.createElement('span');
  deleteIconEl.className = 'material-symbols-outlined';
  deleteIconEl.innerHTML = 'delete';
  deleteBtnEl.append(deleteIconEl);

  // TODO 완료 여부 수정 이벤트
  checkboxEl.addEventListener('change', () => {
    const id = data.id;
    const title = inputEl.value;
    const done = checkboxEl.checked;
    const order = todoItemEl.dataset.order as string;
    fnUpdateTodo({ id, title, done, order });
  });

  // TODO 수정 이벤트
  inputEl.addEventListener('change', () => {
    const id = data.id;
    const title = inputEl.value;
    const done = checkboxEl.checked;
    const order = todoItemEl.dataset.order as string;
    fnUpdateTodo({ id, title, done, order });
  });

  // TODO 삭제 이벤트
  deleteBtnEl.addEventListener('click', (event) => {
    const todosEl = document.querySelector('.todos') as HTMLElement;
    const target = event.target as HTMLElement;
    const parentEl = target.closest('.todo-item') as HTMLElement;
    todosEl.removeChild(parentEl);
    fnDeleteTodo(data.id);
  });

  const todosEl = document.querySelector('.todos') as HTMLElement;
  todoItemEl.append(orderHandleEl, checkboxEl, inputEl, dateEl, deleteBtnEl);
  todosEl.append(todoItemEl);
};

// TODO 목록 렌더링
export async function renderTodoList(done?: string, order?: string) {
  let res = Array.from(await getListTodo()).reverse() as dataType[];

  if (order === 'recent') res.sort((a, b) => +new Date(b.createdAt!) - +new Date(a.createdAt!));
  else if (order === 'old') res.sort((a, b) => +new Date(a.createdAt!) - +new Date(b.createdAt!));

  if (done === 'true') res = res.filter((item) => item.done === true);
  else if (done === 'false') res = res.filter((item) => item.done === false);

  curOrder = res.length;
  setElementHtml('.todo-length', String(curOrder));
  setElementHtml('.todos');
  if (res.length === 0) showToast('등록된 할 일이 없습니다.');
  else res.forEach((item) => renderTodo(item));
}

// TODO 수정
async function fnUpdateTodo(obj: dataType) {
  showElement('.loading');
  try {
    await updateTodo(obj);
    renderTodoList();
    showToast('수정이 완료되었습니다.');
  } catch (error) {
    showToast();
  } finally {
    hideElement('.loading');
  }
}

// TODO 삭제
async function fnDeleteTodo(id: string) {
  showElement('.loading');
  try {
    await deleteTodo(id);
    await fnReorderTodo();
    renderTodoList();
    showToast('삭제가 완료되었습니다.');
  } catch (error) {
    showToast();
  } finally {
    hideElement('.loading');
  }
}

// Drag & Drop 순서 변경
const todosEl = document.querySelector('.todos') as HTMLElement;
const sortable = Sortable.create(todosEl, {
  group: 'todos',
  animation: 100,
  handle: '.order-handle',
  onStart: function (event) {
    const type = document.querySelector('.type') as HTMLSelectElement;
    const order = document.querySelector('.order') as HTMLSelectElement;
    if (type.value !== '') {
      sortFlag = false;
      alert('모두 보기 시 정렬이 가능합니다.');
    } else if (order.value !== '') {
      sortFlag = false;
      alert('커스텀 순 보기 시 정렬이 가능합니다');
    } else sortFlag = true;
  },
  onEnd: async function () {
    if (sortFlag) {
      showElement('.loading');
      try {
        await fnReorderTodo();
        renderTodoList();
        showToast('순서 변경이 완료되었습니다.');
      } catch (error) {
        showToast();
      } finally {
        hideElement('.loading');
      }
    }
  },
});

// 순서 재정렬
export async function fnReorderTodo() {
  const ids: string[] = [];
  const todoItems = document.querySelectorAll('.todo-item') as NodeListOf<HTMLElement>;
  todoItems.forEach((item) => {
    if (item.dataset.id) ids.unshift(item.dataset.id);
  });
  await reorderTodo(ids);
}
