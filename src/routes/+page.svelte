<script>
    import StateSpy from '$lib/state-spy.svelte';
    let {data} = $props();
</script>

<StateSpy 
    --maxwidth="60vw"
    position="top-right"
    data={data} />

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

