function illegalize(subject) {
  if (!subject) return;

  alert(subject + ' is now illegal!');
}

function submitIllegalize(form) {
  if (!(form && form.subject)) return false;

  var subject = form.subject.value;

  if (!subject) {
    form.subject.focus()
    return false;
  }

  illegalize(subject);
  return false;
}