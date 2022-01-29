import React, {useEffect} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function App() {

  //State
  const [prefectures, setPrefectures] = React.useState([]);
  const [selectedPref, setSelectedPref] = React.useState(Array(47).fill(false));
  const [prefSeries, setPrefSeries] = React.useState([]);

  //データ取得
  useEffect(() => {fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures"
  ,{
    headers: {
      'X-API-KEY': "PZ1Mxii5zb4Z3aUtq250ncgRAfnTxCoTeW5UXpZz"
    }
  }
  )
  .then(response => response.json())
  .then(res => {
    setPrefectures(res.result);
  })}, []);

  //都道府県選択と人口データ取得
  const selection = (index) => {
    const selectedPref_copy = selectedPref.slice();
    selectedPref_copy[index] = !selectedPref_copy[index];

    if (!selectedPref[index]) {
      fetch(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${index+1}`,
        {
          headers: { 'X-API-KEY': "PZ1Mxii5zb4Z3aUtq250ncgRAfnTxCoTeW5UXpZz" }
        }
      )
        .then(response => response.json())
        .then(res => {
          let tmp = [];
          Object.keys(res.result.data[1].data).forEach(i => {
            tmp.push(res.result.data[1].data[i].value);
          });
          const res_series = {
            name: prefectures[index].prefName,
            data: tmp
          };
          setSelectedPref(selectedPref_copy);
          setPrefSeries([...prefSeries, res_series]);
        });
    } else {
      const prefSeries_copy = prefSeries.slice();
      for (let i = 0; i < prefSeries_copy.length; i++) {
        if (prefSeries_copy[i].name === prefectures[index].prefName) {
          prefSeries_copy.splice(i, 1);
        }
      }
      setSelectedPref(selectedPref_copy);
      setPrefSeries(prefSeries_copy);
    }
  } 

  const CheckBox = (props) => {
    return (
      <input
        type="checkbox"
        name="inputNames"
        checked={props.checked}
        onChange={props.onChange}
      />
    )
  }
  
  const options = {
    title: {
      text: '総人口増減'
    },
    plotOptions: {
      series: {
        label: {
          connectorAllowed: false
        },
        pointInterval: 5,
        pointStart: 1980
      }
    },
    series: prefSeries
  };

  return (
    <div className='main'>
      <form className='form'>
        <h2>都道府県</h2>
        {prefectures.map((item, index) => {
          return (
            <div className='prefCheck'>
              <label htmlFor={`id_${index}`} key={`id_${index}`} className='prefCheck'>
                <CheckBox
                  id={index}
                  value={item}
                  onChange={() => selection(item.prefCode - 1)}
                  checked={selectedPref[item.prefCode - 1]}
                />
                {item.prefName}
              </label>
            </div>
          )
        })}
      </form>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default App;
