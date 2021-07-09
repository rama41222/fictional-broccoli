import "./dashboard.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiRequestData, Frequency, SearchType } from "./dashboard.types";
import { queryStationByAt, queryStationById } from "./services/station.service";
import { Form, Button } from "react-bootstrap";

function Dashboard() {
  const [showRange, setShowRange] = useState(false);
  const [stations, setStations] = useState({});
  const [errorMessages, setErrorMessages] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const setRangeHandler = (data: SearchType) => {
    if (data === SearchType.SpeficTime) {
      setShowRange(false);
    } else {
      setShowRange(true);
    }
  };

  const search = async (data: ApiRequestData) => {
    if (!showRange) {
      const response = await queryStationByAt(data);
      if (!response) {
        setErrorMessages("Api Response is empty");
      }
      setStations(response);
    }

    if (showRange) {
      const response = await queryStationById(data);
      if (!response) {
        setErrorMessages("Api Response is empty");
      }
      setStations(response);
    }
  };

  return (
    <>
      <div className="dashboard">
        <h1>Dashboard</h1>
      </div>
      {errorMessages && <div>{errorMessages}</div>}
      <div>
        <Form inline onSubmit={handleSubmit(search)}>
          <Form.Group controlId="frequency">
            <Form.Label>Search Type:</Form.Label>
            <Form.Control
              as="select"
              {...register("searchType")}
              name="searchType"
              onChange={(e) => setRangeHandler(e.target.value as SearchType)}
            >
              <option value={SearchType.SpeficTime}>
                On or After a specific time
              </option>
              <option value={SearchType.TimeRange}>Time Range</option>
            </Form.Control>
          </Form.Group>
          {!showRange && (
            <Form.Group controlId="at">
              <Form.Label>at:</Form.Label>
              <Form.Control
                type="datetime-local"
                placeholder="at"
                {...register("at", { required: "At is required" })}
              />
            </Form.Group>
          )}

          {showRange && (
            <>
              <Form.Group controlId="id">
                <Form.Label>Kiosk ID:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Kiosk ID"
                  {...register("id", { required: "Kiosk ID is required" })}
                />
              </Form.Group>

              <Form.Group controlId="from">
                <Form.Label>From:</Form.Label>
                <Form.Control
                  type="datetime-local"
                  placeholder="From"
                  {...register("from", { required: "From is required" })}
                />
              </Form.Group>
              <Form.Group controlId="to">
                <Form.Label>to:</Form.Label>
                <Form.Control
                  type="datetime-local"
                  placeholder="To"
                  {...register("to", { required: "To is required" })}
                />
              </Form.Group>

              <Form.Group controlId="frequency">
                <Form.Label> Select the Frequency:</Form.Label>
                <Form.Control as="select" {...register("frequency")}>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                </Form.Control>
              </Form.Group>
            </>
          )}

          <Form.Group controlId="submit">
            <div>{errors.from && <span>{errors.from.message}</span>}</div>
            <Button type="submit" value="Submit">
              Search
            </Button>
          </Form.Group>
        </Form>
      </div>
      <div>
        <hr />
        <pre>{JSON.stringify(stations, null, 2)}</pre>
      </div>
    </>
  );
}

export default Dashboard;
