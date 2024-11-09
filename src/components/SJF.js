import React, { useState } from 'react';

function SJF() {
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

    const simulateSJF = () => {
        let currentTime = 0;
        const resultsData = [];
        const sequence = [];
        const sortedProcesses = [...processes].sort((a, b) => a.arrival - b.arrival);

        while (sortedProcesses.length > 0) {
            // eslint-disable-next-line no-loop-func
            const availableProcesses = sortedProcesses.filter(p => p.arrival <= currentTime);
            let selectedProcess;

            if (availableProcesses.length > 0) {
                selectedProcess = availableProcesses.sort((a, b) => a.burst - b.burst)[0];
                sortedProcesses.splice(sortedProcesses.indexOf(selectedProcess), 1);
            } else {
                selectedProcess = sortedProcesses.shift();
                currentTime = selectedProcess.arrival;
            }

            selectedProcess.completion = currentTime + selectedProcess.burst;
            selectedProcess.turnaround = selectedProcess.completion - selectedProcess.arrival;
            selectedProcess.waiting = selectedProcess.turnaround - selectedProcess.burst;
            resultsData.push(selectedProcess);
            sequence.push(selectedProcess);
            currentTime += selectedProcess.burst;
        }

        setResults(resultsData);
        animateSimulation(sequence);
    };

    const animateSimulation = (sequence) => {
        setSimulationSequence([]);
        setIsSimulating(true);

        sequence.forEach((process, index) => {
            setTimeout(() => {
                setSimulationSequence((prev) => [...prev, process]);
                if (index === sequence.length - 1) {
                    setIsSimulating(false);
                }
            }, index * 1000);
        });
    };

    return (
        <div className="box p-4">
            <h2>Shortest Job First (SJF) Simulation</h2>
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
                    onClick={simulateSJF}
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
                </div>
            )}

            <div className="simulation-box mt-4">
                <h3>Simulation Output</h3>
                <div className="process-container">
                    {simulationSequence.map((process) => (
                        <button key={process.id} className="btn btn-primary mr-2 mb-2">
                            P{process.id}
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

export { SJF };