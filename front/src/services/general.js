export function postFormHTML(path, params, method='post') {
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = key;
    hiddenField.value = params[key];

    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  form.submit();
  // window.location.href = window.location.origin + '/Success';
}

export const NOTINH = '';