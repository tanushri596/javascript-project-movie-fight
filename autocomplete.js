const createAutoComplete = ({root,renderOption,onOptionSelect,inputValue,fetchData})=>
{
    
    root.innerHTML = 
    `
    <label><b>Search</label>
    <input class="input" />
    <div class="dropdown">
            <div class="dropdown-menu">
              <div class="dropdown-content results"></div>
            </div>
     </div>
    `
    const inputEle = root.querySelector("input");
    const dropdown = root.querySelector(".dropdown");
    const resultWrapper = root.querySelector(".results");
    
    const onInput = async event => {
        const items = await fetchData(event.target.value);
    
        if(!items.length)
        {
            dropdown.classList.remove('is-active');
            return;
        }
       
        resultWrapper.innerHTML='';
        dropdown.classList.add('is-active');
        for(let item of items)
        {
            const oneItem = document.createElement('a');
            oneItem.classList.add('dropdown-item')
            oneItem.innerHTML = renderOption(item);
    
            oneItem.addEventListener('click',()=>
            {
                dropdown.classList.remove('is-active');
                inputEle.value = inputValue(item);
                onOptionSelect(item);
            })
    
            resultWrapper.appendChild(oneItem);
    
            
        }
    };
    
    
    
    inputEle.addEventListener("input", debounce(onInput, 1000));
    document.addEventListener('click',(event)=>
    {
      if(!root.contains(event.target))
      {
        dropdown.classList.remove('is-active');
      }
    })
}