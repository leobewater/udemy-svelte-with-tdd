<script>
  import axios from 'axios';
  import Input from '../components/Input.svelte';

  export let changeListener;

  let username, email, password, passwordRepeat;
  let apiProgress = false;
  let signUpSuccess = false;
  let errors = {};

  $: disabled = password && passwordRepeat ? password !== passwordRepeat : true;
  $: passwordMismatch = password !== passwordRepeat;
  // watching variables and clear the errors when variables has some values
  $: {
    if (username) {
      errors.username = '';
    }
    if (email) {
      errors.email = '';
    }
    if (password) {
      errors.password = '';
    }
  }

  const submit = async () => {
    apiProgress = true;

    try {
      await axios.post('/api/1.0/users', {
        username,
        email,
        password,
      });
      signUpSuccess = true;
    } catch (error) {
      if (error.response.status === 400) {
        errors = error.response.data.validationErrors;
      }
      apiProgress = false;
    }
  };

  const onChangeUsername = (event) => {
    console.log("SignUpPage is receiving --> ", event.detail);
  }
</script>

<div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
  {#if !signUpSuccess}
    <form class="card mt-5" data-testid="form-sign-up">
      <div class="card-header">
        <h1 class="text-center">Sign Up</h1>
      </div>

      <div class="card-body">
        <Input
          id="username"
          label="Username"
          help={errors.username}
          bind:entry={username}
          on:input
        />
        <Input
          id="e-mail"
          type="email"
          label="E-mail"
          help={errors.email}
          bind:entry={email}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          help={errors.password}
          bind:entry={password}
        />
        <Input
          id="password-repeat"
          type="password"
          label="Password Repeat"
          help={passwordMismatch ? 'Password mismatch' : ''}
          bind:entry={passwordRepeat}
        />

        <div class="text-center">
          <button
            class="btn btn-primary"
            disabled={disabled || apiProgress}
            on:click|preventDefault={submit}
          >
            {#if apiProgress}
              <span class="spinner-border spinner-border-sm" role="status" />
            {/if}
            Sign Up</button
          >
        </div>
      </div>
    </form>
  {:else}
    <div class="alert alert-success mt-3">
      Please check your e-mail to activate your account
    </div>
  {/if}
</div>
