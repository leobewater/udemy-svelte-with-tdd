<script>
  import { onMount } from 'svelte';

  export let label = '',
    id = '',
    entry = '',
    help = '',
    type = 'text', onChange;

  // use reference and onMount to assign dynamic type
  let inputElement;
  onMount(() => {
    inputElement.type = type;
  });
</script>

<div class="form-group">
  <label for={id}>{label}</label>
  <input
    bind:this={inputElement}
    {id}
    class="form-control"
    class:is-invalid={help}
    bind:value={entry}
    on:input={onChange}
  />
  {#if help}
    <span class="invalid-feedback" role="alert">{help}</span>
  {/if}
</div>
