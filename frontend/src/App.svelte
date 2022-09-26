<script>
  import SignUpPage from './pages/SignUpPage.svelte';

  const changeListener = (event) => {
    // console.log("App is receiving --> ", event.detail)
    console.log("App is receiving --> ", event.target.value)
  }
</script>

<div class="container">
  <SignUpPage on:input={changeListener} />
</div>
