<script>
    import { scale, slide, fade } from "svelte/transition";
    let {
        position = 'top-right',
        data,
        name = 'data',
        type = 'Object',
        open = true,        // is the StateSpy widget open
        value_open = true,  // is the value section open
        depth = 0,
        child = false
    } = $props();

    const pos = {top: null, left: null, bottom: null, right: null};
    const pos_map = {
        'top-left': {top: '10px', left: '10px'},
        'top-right': {top: '10px', right: '10px'},
        'bottom-left': {bottom: '10px', left: '10px'},
        'bottom-right': {bottom: '10px', right: '10px'}
    }
    Object.assign(pos, pos_map[position]);

    const get_position = (pos) => {
        return Object.entries(pos).map(([k, v]) => `${k}:${v}`).join(';');
    }

    // arrays should be initially closed
    value_open = value_open && type !== 'Array' && type !== 'Object-Small'

    $effect(() => {
        // onMount
        sessionStorage.removeItem('state-spy-width')
    });

    const is_object = item => item !== null && typeof item === 'object' && !Array.isArray(item);

    function convert_object(obj) {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, convert_value(v)]));
    }

    // We only need/want to convert one level of values, the svelte:self call will take
    // care of the recursive case.
    function convert_value(item) {
        if (item === null) return [null, 'null'];
        if (item === undefined) return [undefined, 'undefined'];
        if (typeof item === 'string') return [item, item.length > 30 ? 'string-big' : 'string'];
        if (typeof item === 'boolean' || typeof item === 'number') return [item, typeof item];
        if (item instanceof Date) return [item, 'Date'];
        if (Array.isArray(item)) {
            if (item.length === 0) return [item, 'Array-Empty'];
            if (item.length <= 3) return [item, 'Array-Small'];
            if (is_object(item[0])) return [item, 'Array-Object'];
            return [item, 'Array'];
        }
        if (typeof item === 'object') {
            const size = Object.keys(item).length;
            if (size === 0) return [item, 'Object-Empty'];
            if (size === 1 && JSON.stringify(item).length < 20) return [item, 'Object-Small'];
            return [item, 'Object'];
        }
    }

    function convert_item(item) {
        if (item === null) return [null, 'null'];
        if (item === undefined) return [undefined, 'undefined'];
        if (typeof item === 'string') return [item, item.length > 30 ? 'string-big' : 'string'];
        if (typeof item === 'boolean' || typeof item === 'number') return [item, typeof item];
        if (item instanceof Date) return [item, 'Date'];
        if (Array.isArray(item)) return [Object.fromEntries(item.map((v, i) => [i, convert_value(v)])), 'Array'];
        if (typeof item === 'object') return [convert_object(item), 'Object'];
    }

    // create the dict we will use to render the data
    let strdata = $derived.by(() => convert_item(data)[0]);

    function toggle_state_spy(e) {
        open = !open
        const root = document.querySelector('.state-spy.root');
        if (open) {
            root.style.width = 'fit-content';
            root.style.height = 'fit-content';
        } else {
            const size = '32px';  // 40 will make it square...
            root.style.width = size;
            root.style.height = size;
        }
    }

    function toggle_section(e) {
        // prevent width of root from changing when collapsing
        let session_width = sessionStorage.getItem('state-spy-width');
        if (session_width === null) {
            session_width = document.querySelector('.state-spy.root').offsetWidth;
            sessionStorage.setItem('state-spy-width', session_width);
        } 
        const root = document.querySelector('.state-spy.root');
        root.style.width = session_width + 'px';

        value_open = !value_open
    }

    function key_handler(e) {
        if (e.key === 'Enter') {
            toggle_section(e);
        }
    }

    const indent = 24;
</script>


{#snippet key_snippet({depth, name, header, collapsible})}
    <span class="key" class:object={header} style="padding-left:{(collapsible ? -7 : 7) + depth*indent}px">
        {#if collapsible}
        {#if !value_open}
            <svg class="icon collapsed-close-icon" style="margin-right:-5px;width:16px; height:16px;vertical-align:-2px" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 16 4-4-4-4"/>
            </svg>
        {:else}
            <svg class="icon collapsed-open-icon" style="margin-right:-5px;width:16px; height:16px;vertical-align:-2px" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
            </svg>
            {/if}
        {/if}
        
        {name}
    </span>
{/snippet}


{#snippet content()}
<li class="snippet-content">
    <div class="item collapsible" onkeyup={key_handler} role="button" tabindex="0" data-open={value_open}
         onclick={toggle_section}>
        {@render key_snippet({depth, name, header: true, collapsible: true})}
        {#if !value_open}
            <span class="value">{JSON.stringify(data)}</span>
        {/if}
        <div class="type">{type?.split('-')[0]}</div>
    </div>
    <ol class="outside-each" class:closed={!value_open} role="group">
        {#if value_open}
            {#each Object.keys(strdata) as key}
                {@const val = strdata[key][0]}
                {@const valtype = strdata[key][1]}
                {@const display_valtype = valtype?.split('-')[0]}
            
                {#if ['Object', 'Array', 'Array-Object', 'Object-Small'].includes(valtype)}
                    <svelte:self 
                        data={val} 
                        type={valtype}
                        name={key} 
                        value_open={value_open}
                        depth={depth+1} 
                        child={true}
                        />
                {:else}
                    <li class="inside-each" role="treeitem" aria-selected="false">
                        <!-- the data (when value is a simple type): key, value, type -->
                        <div class="item"  hidden={!value_open}>

                            {@render key_snippet({depth: depth+1, name: key, header: false, collapsible: false})}

                            <!-- the type is added as a class in case we need special formatting -->
                            <span class="value {valtype.toLowerCase()}" title={val}>
                                {#if valtype === 'Array-Empty'}
                                    <span class="empty array">[]</span>
                                {:else if valtype === 'Object-Empty'}
                                    <span class="empty obj">{"{}"}</span>
                                {:else if valtype === 'Array-Small'}
                                    [{val}]
                                {:else if valtype === 'Object-Small'}
                                    {JSON.stringify(val)}
                                {:else}
                                    {val} 
                                {/if}
                            </span>

                            <span class="type">{display_valtype}</span>
                        </div>
                    </li>
                {/if}
            {/each}
        {/if}
    </ol>
</li>
{/snippet}

{#if !child}

    <div class="state-spy" 
        style={get_position(pos)}
        class:root={true} 
        data-depth={depth} 
        class:closed={!open}>
        
        <!-- toggle button -->
        {#if depth === 0}
            <button on:click={toggle_state_spy} aria-label="toggle state spy">
                <svg class="eye-icon" hidden={!open} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-width="1.6" d="M21 12c0 1.2-4 6-9 6s-9-4.8-9-6c0-1.2 4-6 9-6s9 4.8 9 6Z"/>
                    <path stroke="currentColor" stroke-width="1.6" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                </svg>
                <svg class="close-icon"  aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
            </button>
        {/if}

        <div class="state-spy-content">
            <ol class="root">
            {#if open }
                {@render content()}
            {/if}
            </ol>
        </div>
    </div>    
{:else}  <!-- if child -->
    {#if open }
        {@render content()}
    {/if}
{/if}



<style lang="postcss">

    /* reset */
    * {
        padding: 0;
        border-width: 0;
        border: none;
        border-radius: 0;
        margin: 0;
        text-align: left;
        list-style-type: none;
        box-shadow: none;
        outline: none;
    }


    .state-spy {
        --indent: 1.5rem;  /* the tree indentation */
        --background-color: #fefefe;
        --border-color: #999;

        isolation: isolate;

        /* reset */
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 14px !important;
        line-height: 1.4;
        font-weight: normal;
        box-sizing: border-box;
        
        overflow: auto;
        /* resize: both; */
        width: fit-content;
        position: fixed;

        z-index: 1000;
        max-height: 80vh;
        max-width: var(--maxwidth, 80vw);
        
        padding: 30px 10px 10px;
        
        border: 1px solid var(--border-color);
        border-radius: 5px;
        
        transition: background-color 0.2s;
        background-color: var(--background-color);
        /* background-color: red; */


    }
    .state-spy * {
        font-size: 14px !important;
    }

    .state-spy-content {
        outline: var(--debug);
        display: grid;
        grid-template-columns: 
            [key-start] 1fr [key-end value-start] 
            minmax(50px, max-content) [value-end type-start] 
            minmax(62px, max-content) [type-end];
        gap: 1px 20px;
    }

    ol {
        list-style: none;
        padding: 0;
        margin: 0;
    }
 
    .root.closed {
        resize: none;
    }

    .close-icon, .eye-icon {
        --size: 22px;
        width: var(--size);
        height: var(--size);
        stroke: currentColor;
        transition: transform 0.3s;
    }
    .eye-icon {
        --size: 22px;
        display: none;
    }
    .closed .eye-icon {
        display: block;
    }
    .closed .close-icon {
        transform: rotate(45deg);
        display: none;
    }

    button {
        position: absolute;
        top: 3px;
        right: 11px;
        background-color: transparent;
        border: none;
        color: #222;
        font-size: 1.5em;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        margin: 0;
        height: 1rem;
        width: 1rem;
    }
    .closed  {
        background-color: rebeccapurple;
        color: white;

        & button {
            display: inline;
            text-align: center;
            color: white;
        }
    }

    .item, ol, ol[role="group"], li {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: key-start / type-end;
    }
    li { padding: 0; }

    ol.closed > li {
        display: none;
    }

    .item.collapsible {
        cursor: pointer;
        user-select: none;
    }

    li:has(:focus-visible) {
        outline: none;
        background-color: blue;
    }

    .item {

        
        align-items: baseline;
        border-bottom: 1px dotted #ddd;
        background-color: aliceblue;

        &:focus-visible {
            outline: none;
            background-color: #f0f0f0;
        }

        &:hover {
            background-color: #f0f0f0;
        }

        .key {
            font-weight: 500;
            grid-column: key;
            color: #666;

            & svg {
                display: inline;
            }

            &:focus-visible {
                outline: none;
                background-color: #f0f0f0;
            }
        }

        .object {
            grid-column: key-start / key-end;
            font-weight: bold;
            color: #000;
            white-space: nowrap;
        }
        
        .value {
            grid-column: value;
            text-align: left;
            font-family: monospace;
            color: rgb(51, 51, 233);
            font-size: 0.9em;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .type {
            grid-column: type;
            text-align: right;
            color: #666;
            font-size: 0.8em;
            font-style: italic;
        }
    }

    svg.icon {
        display: inline;
    }

    span.key.object {
        font-weight: 800;
    }

    .item.closed {
        display: none;
    }

</style>