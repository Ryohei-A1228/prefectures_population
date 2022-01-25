import React, { useEffect }  from 'react';
import axios from 'axios';

function App() {

  const [prefectures, setPrefectures] = React.useState([]);
  const [populations, setPopulations] = React.useState([]);
  const [selectedPref, setSelectedPref] = React.useState({});

  //データ取得
  axios.get("https://opendata.resas-portal.go.jp/api/v1/prefectures"
  ,{
    headers: {
      'X-API-KEY': "Uqstu8dEiYopWz7qozQExMHaGmih6v6zx5KsDz15"
    }
  }
  ).then(res => {
    setPrefectures(res.data.result);
  });


  const CheckBox = ({id, value, checked, onChange}) => {
    return (
      <input
        id={id}
        type="checkbox"
        name="inputNames"
        value={value}
        onChange={onChange}
        checked={checked}
      />
    )
  }

  const handleChange = e => {
    setSelectedPref({
      ...selectedPref,
      [e.target.id]: e.target.checked
    })
    console.log('selectedPrefs:', selectedPref)
  }


  return (
    <div className='main'>
      <form>
        {prefectures.map((item, index) => {
          index += 1
          return (
            <label htmlFor={`id_${index}`} key={`key_${index}`} className='prefCheck'>
              <CheckBox
                id={index}
                value={item}
                onChange={handleChange}
                checked={selectedPref[item.prefCode]}
              />
              {item.prefName}
            </label>
          )
        })}
      </form>
    </div>
  );
}

export default App;
