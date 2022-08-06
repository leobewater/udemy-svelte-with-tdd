<script>
  let password, passwordRepeat;

  //   const onChangePassword = (event) => {
  //     password = event.target.value;
  //     // refreshDisabled();
  //   };

  //   const onChangePasswordRepeat = (event) => {
  //     passwordRepeat = event.target.value;
  //     // refreshDisabled();
  //   };

  //   const refreshDisabled = () => {
  //     disabled = password !== passwordRepeat;
  //   };

  $: disabled = password && passwordRepeat ? password !== passwordRepeat : true;
</script>

<h1>Sign Up</h1>
<label for="username">Username</label>
<input id="username" />

<label for="e-mail">Email</label>
<input id="e-mail" />

<label for="password">Password</label>
<input id="password" type="password" bind:value={password} />
<!-- <input id="password" type="password" on:input={(event) => (password = event.target.value)} /> -->

<label for="password-repeat">Password Repeat</label>
<input id="password-repeat" type="password" bind:value={passwordRepeat} />

<button {disabled}>Sign Up</button>
