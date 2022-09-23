<script>
  export let label = '',
    id = '',
    entry = '',
    help;
</script>

<div class="form-group">
  <label for={id}>{label}</label>
  <input {id} class="form-control is-invalid" bind:value={entry} />
  {#if help}
    <span class="invalid-feedback" role="alert">{help}</span>
  {/if}
</div>
