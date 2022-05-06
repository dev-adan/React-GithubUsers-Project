import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';
const Repos = () => {

  const {repos} = React.useContext(GithubContext);

  let languages = repos.reduce((total,item) =>{

    const {language} = item;
    if(!language) return total;

    if(!total[language]){
      total[language] = {label : language, value : 1}
    }else{
      total[language] = {...total[language],value : total[language].value + 1}
    }
    return total;
  },{})


 languages = Object.values(languages).sort((a,b) => {
   return b.value - a.value;
 }).slice(0,5)
 

 let {stars,forks} = repos.reduce((total,item) => {
   const {stargazers_count,name,forks} = item;

   total.stars[stargazers_count] = {label : name,value : stargazers_count };

   total.forks[forks] = {label : name,value : forks}


  return total;

 },{stars : {}, forks : {}})
 stars = Object.values(stars).slice(0,5)
 forks = Object.values(forks).slice(0,5)
 console.log(stars)


  const chartData = [
    ...languages
  ];

  return <section>
    <Wrapper className='section-center'>
       {/* <ExampleChart data={chartData}/> */}
       <Pie3D data={chartData}/>
       <Column3D data={stars}/>
       <Doughnut2D data={chartData}/>
       <Bar3D data={forks}/>
    </Wrapper>

  </section>
  
  
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
