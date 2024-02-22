# state-spy

Small widget to display the data property of a page.

## Usage

```html
<script>
    import {StateSpy} from 'state-spy';
    let {
        data  // where data might contain event.locals etc.
    } = $props();
</script>
<StateSpy data />
```

![example screenshot](image.png)

You can toss in other data as well:

```html
<StateSpy data={[data, {my: "dict"}]}>
```

---
packaging:
    
```bash
npm version patch
npx svelte-package
npm publish
```
