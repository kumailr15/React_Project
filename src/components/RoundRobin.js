import React, { useState } from 'react';

function RoundRobin() {
    const [numProcesses, setNumProcesses] = useState(0);
    const [timeQuantum, setTimeQuantum] = useState(''); // Set time quantum to an empty string by default
    const [processes, setProcesses] = useState([]);
    const [results, setResults] = useState([]);
    const [simulationSequence, setSimulationSequence] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleProcessChange = (e) => setNumProcesses(e.target.value);

    const generateProcessInputs = () => {
        const newProcesses = Array.from({ length: numProcesses }, (_, i) => ({
            id: i + 1,
            arrival: '',
            burst: '',
            remainingBurst: '',
        }));
        setProcesses(newProcesses);
    };

    const handleInputChange = (index, field, value) => {
        const newProcesses = [...processes];
        newProcesses[index][field] = value === "" ? "" : parseInt(value); // Handle empty input
        newProcesses[index].remainingBurst = value === "" ? "" : parseInt(value); // Initialize remaining burst time
        setProcesses(newProcesses);
    };

    const simulateRoundRobin = () => {
        if (timeQuantum === "" || isNaN(timeQuantum) || timeQuantum <= 0) {
            alert("Please enter a valid time quantum");
            return;
        }

        let currentTime = 0;
        const resultsData = [];
        const sequence = [];
        const queue = [];
        const processList = [...processes].map(process => ({ ...process }));

        processList.forEach(process => process.remainingBurst = process.burst); // Reset remaining burst times

        while (processList.some(p => p.remainingBurst > 0) || queue.length > 0) {
            // eslint-disable-next-line no-loop-func
            processList.forEach(process => {
                if (process.arrival <= currentTime && process.remainingBurst > 0 && !queue.includes(process)) {
                    queue.push(process);
                }
            });

            if (queue.length > 0) {
                const process = queue.shift();

                if (process.remainingBurst > timeQuantum) {
                    currentTime += timeQuantum;
                    process.remainingBurst -= timeQuantum;
                    sequence.push({ id: process.id, time: currentTime });
                } else {
                    currentTime += process.remainingBurst;
                    process.remainingBurst = 0;
                    process.completion = currentTime;
                    process.turnaround = process.completion - process.arrival;
                    process.waiting = process.turnaround - process.burst;
                    resultsData.push(process);
                    sequence.push({ id: process.id, time: currentTime });
                }

                if (process.remainingBurst > 0) {
                    queue.push(process);
                }
            } else {
                currentTime += 1;
            }
        }

        setResults(resultsData);
        animateSimulation(sequence);
    };

    const animateSimulation = (sequence) => {
        setSimulationSequence([]);
        setIsSimulating(true);

        sequence.forEach((event, index) => {
            setTimeout(() => {
                setSimulationSequence((prev) => [...prev, event]);
                if (index === sequence.length - 1) {
                    setIsSimulating(false);
                }
            }, index * 500);
        });
    };

    return (
        <div className="box p-4">
            <h2>Round Robin (RR) Simulation</h2>
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
                <div className="form-group">
                    <label>Time Quantum:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={timeQuantum}  // Empty value allowed
                        onChange={(e) => setTimeQuantum(e.target.value)}
                        min="1"
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
                    onClick={simulateRoundRobin}
                    disabled={isSimulating}
                >
                    Simulate
                </button>
            </form>

            {processes.length > 0 && (
                <div>
                    {processes.map((process, index) => (
                        <div key={index} className="form-group mt-3">
                            <label>Process {process.id} Arrival Time:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={process.arrival}
                                onChange={(e) => handleInputChange(index, 'arrival', e.target.value)}
                                min="0"
                                required
                            />
                            <label>Process {process.id} Burst Time:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={process.burst}
                                onChange={(e) => handleInputChange(index, 'burst', e.target.value)}
                                min="1"
                                required
                            />
                        </div>
                    ))}
                </div>
            )}

            <div className="simulation-box mt-4">
                <h3>Simulation Output</h3>
                <div className="process-container">
                    {simulationSequence.map((event, index) => (
                        <button key={index} className="btn btn-primary mr-2 mb-2">
                            P{event.id} (t={event.time})
                        </button>
                    ))}
                </div>
            </div>

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
                            <td>{result.id}</td>
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

export { RoundRobin };