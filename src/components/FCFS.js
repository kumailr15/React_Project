import React, { useState } from 'react';

function FCFS() {
    const [numProcesses, setNumProcesses] = useState(0);
    const [processes, setProcesses] = useState([]);
    const [results, setResults] = useState([]);
    const [simulationSequence, setSimulationSequence] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleProcessChange = (e) => setNumProcesses(e.target.value);

    const generateProcessInputs = () => {
        const newProcesses = Array.from({ length: numProcesses }, (_, i) => ({
            id: i + 1,
            arrival: '',  // Set empty string instead of default number
            burst: '',    // Set empty string instead of default number
        }));
        setProcesses(newProcesses);
    };

    const handleInputChange = (index, field, value) => {
        const newProcesses = [...processes];
        newProcesses[index][field] = value === "" ? "" : parseInt(value);
        setProcesses(newProcesses);
    };

    const simulateFCFS = () => {
        // Prepare initial values
        let currentTime = 0;
        const resultsData = [];
        const sequence = [];

        // Sort processes by arrival time for FCFS
        const sortedProcesses = [...processes].sort((a, b) => a.arrival - b.arrival);

        // FCFS scheduling logic
        sortedProcesses.forEach((process) => {
            if (currentTime < process.arrival) {
                currentTime = process.arrival;
            }
            process.completion = currentTime + process.burst;
            process.turnaround = process.completion - process.arrival;
            process.waiting = process.turnaround - process.burst;

            resultsData.push(process);
            sequence.push(process); // Add to sequence for simulation

            currentTime += process.burst;
        });

        setResults(resultsData);
        animateSimulation(sequence); // Start animation sequence
    };

    const animateSimulation = (sequence) => {
        setSimulationSequence([]); // Clear previous sequence
        setIsSimulating(true);

        sequence.forEach((process, index) => {
            setTimeout(() => {
                setSimulationSequence((prev) => [...prev, process]); // Display each process one by one
                if (index === sequence.length - 1) {
                    setIsSimulating(false); // End of simulation
                }
            }, index * 1000); // 1000ms delay per process, adjust as needed
        });
    };

    return (
        <div className="box p-4">
            <h2>First Come First Serve (FCFS) Simulation</h2>
            <form>
                <div className="form-group">
                    <label>Number of Processes:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={numProcesses}
                        onChange={handleProcessChange}
                        min="1"
                        required
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={generateProcessInputs}
                >
                    Generate Inputs
                </button>
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={simulateFCFS}
                    disabled={isSimulating} // Disable button while simulating
                >
                    Simulate
                </button>
            </form>

            {/* Input fields for each process */}
            {processes.map((process, index) => (
                <div key={index} className="form-group">
                    <label>Process {process.id} Arrival Time:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={process.arrival}  // Empty value is possible
                        onChange={(e) => handleInputChange(index, 'arrival', e.target.value)}
                        min="0"
                        required
                    />
                    <label>Process {process.id} Burst Time:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={process.burst}    // Empty value is possible
                        onChange={(e) => handleInputChange(index, 'burst', e.target.value)}
                        min="1"
                        required
                    />
                </div>
            ))}

            <div className="simulation-box mt-4">
                <h3>Simulation Animation</h3>
                <div className="process-container">
                    {simulationSequence.map((process) => (
                        <button key={process.id} className="btn btn-primary m-1">
                            P{process.id}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Table */}
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>Process</th>
                        <th>Arrival Time</th>
                        <th>Burst Time</th>
                        <th>Completion Time</th>
                        <th>Turnaround Time</th>
                        <th>Waiting Time</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result) => (
                        <tr key={result.id}>
                            <td>P{result.id}</td>
                            <td>{result.arrival}</td>
                            <td>{result.burst}</td>
                            <td>{result.completion}</td>
                            <td>{result.turnaround}</td>
                            <td>{result.waiting}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export { FCFS };