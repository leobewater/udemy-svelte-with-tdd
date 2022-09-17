<script>
  // import axios from 'axios';
  let disabled = true;
  let username, email, password, passwordRepeat;

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

  const submit = () => {
    // axios.post('/api/1.0/users', {
    //   username,
    //   email,
    //   password,
    // });
    fetch('/api/1.0/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
  };
</script>

<h1>Sign Up</h1>
<form on:submit|preventDefault={submit}>
  <label for="username">Username</label>
  <input id="username" bind:value={username} />

  <label for="e-mail">Email</label>
  <input id="e-mail" bind:value={email} />

  <label for="password">Password</label>
  <input id="password" type="password" bind:value={password} />
  <!-- <input id="password" type="password" on:input={(event) => (password = event.target.value)} /> -->

  <label for="password-repeat">Password Repeat</label>
  <input id="password-repeat" type="password" bind:value={passwordRepeat} />

  <button {disabled}>Sign Up</button>
</form>
