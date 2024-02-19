<script>
    import { scale, slide, fade } from "svelte/transition";
    let {
        data,
        name = 'data',
        subkey = false,
        open = true,
        value_open = true,
        depth = 0,
        child = false,
        path = ['root'],
        counter = 1
    } = $props();
    // {JSON.stringify(data, null, 2)}


    // generic value to string
    const val2str = (val) => {
        return JSON.stringify(val);
    }

    // date to string
    const date2str = (val) => {
        return val.toLocaleString();
    }

    // array to string
    const arr2str = (val) => {
        return `[${val.map(v => type2str(v, val2type(v))).join(', ')}]`;
    }

    // object to string
    const obj2str = (val) => {
        // maxdepth += 1
        return Object.fromEntries(Object.entries(val).map(([k, v]) => stringify(k, v)));
    }

    const type2str = (val, typename) => {
        switch (typename) {
            case 'null':
                return 'null';
            case 'undefined':
                return 'undefined';
            case 'boolean':
                return val2str(val);
            case 'number':
                return val2str(val);
            case 'string':
                return val2str(val);
            case 'Date':
                return date2str(val);
            case 'Array':
                return arr2str(val);
            case 'Object':
                return obj2str(val);
        }
    }

    const val2type = (val) => {
        if (val === null) return 'null';
        if (val === undefined) return 'undefined';
        if (typeof val === 'boolean' || typeof val === 'number' || typeof val === 'string') return typeof val;
        if (val instanceof Date) return 'Date';
        if (Array.isArray(val)) return 'Array';
        if (typeof val === 'object') return 'Object';
    }

    function stringify(k, v) {
        const typename = val2type(v);
        const strval = type2str(v, typename);
        return [k, [strval, typename, [...path, k]]]
    }

    // let strdata = $derived(Object.fromEntries(Object.entries(data).map(([k, v]) => [k, type2str(v)])));
    let strdata = $derived(Object.fromEntries(Object.entries(data).map(([k, v]) => stringify(k, v))));

    function toggle_state_spy(e) {
        open = !open
        const root = document.querySelector('.state-spy.root');
        if (open) {
            root.style.width = 'fit-content';
            root.style.height = 'fit-content';
        } else {
            const size = '40px';
            root.style.width = size;
            root.style.height = size;
        }
    }

    function toggle_section(e) {
        // prevent width of root from changing when collapsing
        const root = document.querySelector('.state-spy.root');
        const current_width = root.offsetWidth;
        root.style.width = current_width + 'px';

        value_open = !value_open

        // const item = e.target.closest('.item')
        // const controls = item.dataset.controls
        // const open = item.dataset.open === 'true'
        // item.dataset.open = !open
        // document.querySelectorAll(`[data-scope^="${controls}"]`).forEach(el => {
        //     if (open) {
        //         el.classList.add('closed')
        //     } else {
        //         el.classList.remove('closed')
        //         if (el.dataset?.open === 'false') {
        //             el.dataset.open = true
        //         }
        //     }
        // })
    }

    const indent = 24;
</script>


{#snippet key_snippet({depth, name, header, collapsible})}
    <span class="key" class:object={header} style="padding-left:{(collapsible ? -7 : 7) + depth*indent}px">
        {#if collapsible}
        {#if !value_open}
            <svg class="collapsed-close-icon" style="margin-right:-5px;width:16px; height:16px;vertical-align:-2px" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m10 16 4-4-4-4"/>
            </svg>
        {:else}
            <svg class="collapsed-open-icon" style="margin-right:-5px;width:16px; height:16px;vertical-align:-2px" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m8 10 4 4 4-4"/>
            </svg>
            {/if}
        {/if}
        
        {name}
    </span>
{/snippet}



{#snippet content()}
<li class="snippet-content">
    <div class="item collapsible" data-open={value_open}
         onclick={toggle_section}>
        {@render key_snippet({depth, name, header: true, collapsible: true})}
        <div class="type">Object</div>
    </div>
    <ol class="outside-each" class:closed={!value_open}>
        {#if value_open}
    {#each Object.keys(strdata) as key}
    
        {#if strdata[key][1] === 'Object'}
            <svelte:self 
                data={data[key]} 
                subkey 
                name={key} 
                value_open={value_open}
                depth={depth+1} 
                child={true}
                path={[...path, key]}
                counter={counter}
                />
        {:else}
            <li class="inside-each">
            <!-- the data (when value is a simple type): key, value, type -->
            <div class="item" data-scope="{path.join('/')}" hidden={!value_open}>
                {@render key_snippet({depth: depth+1, name: key, header: false, collapsible: false})}
                <!-- the type is added as a class in case we need special formatting -->
                <span class="value {strdata[key][1].toLowerCase()}">
                    {strdata[key][0]} 
                </span>
                <span class="type">{strdata[key][1]}</span>
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
        class:root={!subkey} 
        class:subkey data-depth={depth} 
        class:closed={!open}>

        <!-- toggle button -->
        {#if depth === 0}
            <button on:click={toggle_state_spy}>
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

{:else}
    {#if open }
        {@render content()}
    {/if}
{/if}



<style lang="postcss">
    .state-spy {
        --indent: 1.5rem;  /* the tree indentation */
        --background-color: #fefefe;
        /* --background-color: #dba3a3; */
        --border-color: #999;

        /* --debug: 4px dashed rgb(155, 155, 4); */

        /* reset */
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 14px;
        line-height: 1.4;
        font-weight: normal;
        
        overflow: auto;
        /* resize: both; */
        width: fit-content;
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 1000;
        max-height: 80vh;
        
        padding: 30px 10px 10px;
        
        border: 1px solid var(--border-color);
        border-radius: 5px;
        
        transition: background-color 0.2s;
        background-color: var(--background-color);

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

    .subkey {
        padding-left: var(--indent);
    }

    ol {
        list-style: none;
        padding: 0;
        margin: 0;
    }

 
    .root.closed {
        /* width: 1.5rem;
        height: 1.5rem; */
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
            position: inline;
            text-align: center;
            color: white;
        }
    }
    pre {margin-top: 2rem;}
    h3 {
        --size: 16px;
        font-size: 1em;
        margin-bottom: 0;
        text-indent: calc(-1 * var(--indent));
        font-weight: 600;
        margin-left: -9px;

        &:before {
            content: '';
            border: 5px solid transparent;
            vertical-align: middle;
            border-top-color: #666;
            display: inline-block;
            transform: translateX(-4px) translateY(2px);
            transition: transform 0.159s;
            cursor: pointer;
        }
    }

    h3.collapsed:before {
        content: '';
        transform: rotate(-90deg) ;
        /* border-color: transparent;
        border-top-color: #666; */
    }
    [data-depth="0"] > .content > h3 {
        text-indent: 0;
    }

    .closed > .content > h3:before {
        content: '◢';
    }

    .item, ol, li {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: key-start / type-end;
    }

    ol.closed > li {
        display: none;
    }

    .item.collapsible {
        cursor: pointer;
        user-select: none;
    }

    .item {
        

        align-items: baseline;
        border-bottom: 1px dotted #ddd;
        background-color: aliceblue;

        &:hover {
            background-color: #f0f0f0;
        }

        .key {
            font-weight: 500;
            grid-column: key;
            color: #666;
        }


        .object {
            grid-column: key-start / value-end;
            font-weight: bold;
            color: #000;
        }
        
        .value {
            grid-column: value;
            text-align: left;
            font-family: monospace;
            color: rgb(51, 51, 233);
            font-size: 0.9em;
        }
        .value.string, .value.array {
            hanging-punctuation: first last;
        }
        .type {
            grid-column: type;
            text-align: right;
            color: #666;
            font-size: 0.8em;
            font-style: italic;
        }
    }

    .item.closed {
        display: none;
    }

    .object {
        grid-column: key-start / value-end;
        font-weight: bold;
        color: #000;
    }

</style>