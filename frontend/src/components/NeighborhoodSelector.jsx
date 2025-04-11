// src/components/NeighborhoodSelector.jsx
import React from 'react';

function NeighborhoodSelector({
  neighborhoods,
  issues,
  selectedNeighborhood,
  onNeighborhoodChange,
}) {
  const filteredIssues = selectedNeighborhood
    ? issues.filter((issue) => issue.neighborhood === selectedNeighborhood)
    : issues; // Show all if none selected initially or add a "Show All" option

  return (
    <div className="mb-4 p-4 bg-light border rounded">
      <h2 className="h5 mb-3">Neighborhood Issues</h2>
      <div className="mb-3">
        <label htmlFor="neighborhoodSelect" className="form-label">
          Select a Neighborhood:
        </label>
        <select
          id="neighborhoodSelect"
          className="form-select"
          value={selectedNeighborhood}
          onChange={(e) => onNeighborhoodChange(e.target.value)}
        >
          <option value="">-- Select --</option>
          {/* <option value="All">Show All</option> */}
          {neighborhoods.map((hood) => (
            <option key={hood} value={hood}>
              {hood}
            </option>
          ))}
        </select>
      </div>

      {selectedNeighborhood && (
        <div>
          <h3 className="h6 mb-2">Issues in {selectedNeighborhood}:</h3>
          {filteredIssues.length > 0 ? (
            <ul className="list-group">
              {filteredIssues.map((issue) => (
                <li key={issue.id} className="list-group-item">
                  <h4 className="h6 mb-1">{issue.title}</h4>
                  <p className="mb-0 small">{issue.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No issues listed for this neighborhood.</p>
          )}
        </div>
      )}
       {!selectedNeighborhood && (
         <p className="text-muted">Select a neighborhood to see relevant issues.</p>
       )}
    </div>
  );
}

export default NeighborhoodSelector;
