<script>
  let disabled = true;
  let password, passwordRepeat;

  const onChangePassword = (event) => {
    password = event.target.value;

    if (password === passwordRepeat) {
      disabled = false;
    } else {
      disabled = true;
    }
  };

  const onChangePasswordRepeat = (event) => {
    passwordRepeat = event.target.value;

    if (password === passwordRepeat) {
      disabled = false;
    } else {
      disabled = true;
    }
  };
</script>

<h1>Sign Up</h1>
<label for="username">Username</label>
<input id="username" />

<label for="e-mail">Email</label>
<input id="e-mail" />

<label for="password">Password</label>
<input id="password" type="password" on:input={onChangePassword} />

<label for="password-repeat">Password Repeat</label>
<input id="password-repeat" type="password" on:input={onChangePasswordRepeat} />

<button {disabled}>Sign Up</button>
