<script>
export let label, id, entry = '', help;
</script>

<div class="form-group">
  <label for="{id}">{label}</label>
  <input id="{id}" class="form-control" bind:value={entry} />
  {#if help}
    <span role="alert">{help}</span>
  {/if}
</div>
