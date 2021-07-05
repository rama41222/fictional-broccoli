import "./dashboard.css";
import { useEffect } from 'react'


function Dashboard() {

  useEffect(()=> {
    console.log('initial api call')
  },[])

  return (
    <>
      <div className="dashboard">
        <h1>Dashboard</h1>
      </div>
      <div>
        <form>
          <div>
            <input type="text" placeholder="From" />
          </div>
          <div>
            <input type="text" placeholder="to" />
          </div>
          <div>
            <input type="text" placeholder="at" />
          </div>
          <div>
            <label>
              Select the frequency
              <select>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
            </label>
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div>
        Your Data here
      </div>
    </>
  );
}

export default Dashboard;
