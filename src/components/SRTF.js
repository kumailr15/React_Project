import React, { useState } from 'react';

function SRTF() {
    const [numProcesses, setNumProcesses] = useState(0);
    const [processes, setProcesses] = useState([]);
    const [results, setResults] = useState([]);
    const [simulationSequence, setSimulationSequence] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleProcessChange = (e) => setNumProcesses(e.target.value);

    const generateProcessInputs = () => {
        const newProcesses = Array.from({ length: numProcesses }, (_, i) => ({
            id: i + 1,
            arrival: '',  // Set empty string for arrival time
            burst: '',    // Set empty string for burst time
            remainingBurst: '', // Initialize remainingBurst as empty
        }));
        setProcesses(newProcesses);
    };

    const handleInputChange = (index, field, value) => {
        const newProcesses = [...processes];
        newProcesses[index][field] = value === "" ? "" : parseInt(value); // Handle empty input
        newProcesses[index].remainingBurst = value === "" ? "" : parseInt(value); // Initialize remaining burst time
        setProcesses(newProcesses);
    };

    const simulateSRTF = () => {
        let currentTime = 0;
        const resultsData = [];
        const sequence = [];
        const processList = [...processes].map(process => ({ ...process })); // Copy processes with remainingBurst

        while (processList.some(p => p.remainingBurst > 0)) {
            const availableProcesses = processList.filter(
                // eslint-disable-next-line no-loop-func
                (p) => p.arrival <= currentTime && p.remainingBurst > 0
            );

            let selectedProcess;

            if (availableProcesses.length > 0) {
                selectedProcess = availableProcesses.sort((a, b) => a.remainingBurst - b.remainingBurst)[0];
                sequence.push({ id: selectedProcess.id, time: currentTime });
                selectedProcess.remainingBurst -= 1;
                currentTime += 1;

                if (selectedProcess.remainingBurst === 0) {
                    selectedProcess.completion = currentTime;
                    selectedProcess.turnaround = selectedProcess.completion - selectedProcess.arrival;
                    selectedProcess.waiting = selectedProcess.turnaround - selectedProcess.burst;
                    resultsData.push(selectedProcess);
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
            <h2>Shortest Remaining Time First (SRTF) Simulation</h2>
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
                    onClick={simulateSRTF}
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
                                value={process.arrival}  // Empty value allowed
                                onChange={(e) => handleInputChange(index, 'arrival', e.target.value)}
                                min="0"
                                required
                            />
                            <label>Process {process.id} Burst Time:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={process.burst}    // Empty value allowed
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

export { SRTF };