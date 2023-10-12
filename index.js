const autoCompleteConfig = {

    renderOption(movie)
    {
        return  `
         <img src = "${movie.Poster}">
         ${movie.Title} ${movie.Year}
        `
    },
   
    inputValue(movie)
    {
       return movie.Title;
    },
    async  fetchData(searchParam) {
        const res = await axios.get("http://www.omdbapi.com/", {
          params: {
            apikey: "46f33163",
            s: searchParam,
          },
        });
      
        if(res.data.Error)
        return [];
      
        return res.data.Search;
      }

};

createAutoComplete({
    ...autoCompleteConfig,
    root:document.querySelector('#right-autocomplete'),
    onOptionSelect(movie)
    {
        document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie,document.querySelector('#right-summary'),'right');
    },
   
})

createAutoComplete({
    ...autoCompleteConfig,
    root:document.querySelector('#left-autocomplete'),
    onOptionSelect(movie)
    {
        document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie,document.querySelector('#left-summary'),'left');
    },
   
})


let leftMovie;
let rightMovie;

const onMovieSelect = async (movie,summaryElement,side) =>
{
    const res = await axios.get("http://www.omdbapi.com/", {
        params: {
          apikey: "46f33163",
         i : movie.imdbID
        }
      });
    
      summaryElement.innerHTML = movieTemplate(res.data);

      if(side == 'left')leftMovie = res.data;
      else rightMovie = res.data;

      if(leftMovie && rightMovie)
      {
        runComparison();
      }
}

const runComparison = ()=>
{
    const leftStats = document.querySelectorAll('#left-summary .notification');
    const rightStats = document.querySelectorAll('#right-summary .notification');

    leftStats.forEach((leftStat,ind)=>
    {
        const rightStat = rightStats[ind];
        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);

        if(leftSideValue < rightSideValue)
        {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
            rightStat.classList.add('is-success');
        }
        else
        {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning'); 
            leftStat.classList.add('is-success');  
        }

    })
}


const movieTemplate = movieDetail =>
{
   const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
   const metaScore = parseInt(movieDetail.Metascore);
   const imdbRating = parseFloat(movieDetail.imdbRating);
   const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
   const awards = movieDetail.Awards.split(' ').reduce((prev,word)=>
   {
    const value = parseInt(word);
    if(isNaN(value))return prev;
    else
    return prev + value;

   },0)

    return `
    <article class="media">
    <figure class="media-left">
      <p class="image">
      <img src="${movieDetail.Poster}"/>
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
   <h1>${movieDetail.Title}</h1>
   <h4>${movieDetail.Genre}</h4>
   <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>
  <article data-value = ${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value = ${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article data-value = ${metaScore} class="notification is-primary">
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">MetaScore</p>
</article>
<article data-value = ${imdbRating} class="notification is-primary">
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">Rating</p>
</article>
<article data-value = ${imdbVotes} class="notification is-primary">
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">Votes</p>
</article>
  `;
  
};