import React, { useState, useEffect } from 'react';

function AttendanceDownloader() {
  
  const formatDate = (date) => date.toISOString().split('T')[0];

  const today = new Date();
  const getToday = () => new Date();
  const getYesterday = () => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return y;
  };

  const [startDate, setStartDate] = useState(formatDate(getYesterday()));
  const [endDate, setEndDate] = useState(formatDate(getToday()));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const timeToMidnight = midnight - now;

    const timer = setTimeout(() => {
      setStartDate(formatDate(getYesterday()));
      setEndDate(formatDate(getToday()));
    }, timeToMidnight);

    return () => clearTimeout(timer);
  }, [startDate, endDate]);

  const formatDateTime = (dateStr) => {
    return dateStr ? `${dateStr} 00:00:00` : '';
  };
  const formatDateTimet = (dateStr) => {
    return dateStr ? `${dateStr} 23:59:59` : '';
  };

  const fetchAndDownload = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    setLoading(true);
    try {
      const start = formatDateTime(startDate);
      const end = formatDateTimet(endDate);

      const token =
        '116f-c0e3-1041-a13a-3834-1950-8901-ebd3-79b8-fd16-3a8d-73fd-394a-0b22-a72b-5d27';
      const url = `https://api-inovace360.com/api/v1/logs?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(
        end
      )}&api_token=${token}&per_page=1000`;

      const response = await fetch(url);
      const json = await response.json();

       const formattedData = json.data.map((log) => {
         const [dates, times] = log.logged_time.split(' ');
         const datet=dates.replaceAll('-', '');
         const timet=times.replaceAll(':', '');
         return `001:${log.rfid || 'N/A'}:${datet}:${timet}`;
       });

      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const mmdd = `${month}${day}`;

      const blob = new Blob([formattedData.join('\n')], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `DATA${mmdd}a.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      alert('Failed to fetch attendance logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      <h2>Download Attendance Logs</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <button onClick={fetchAndDownload} disabled={loading}>
        {loading ? 'Downloading...' : 'Download Logs'}
      </button>

      <footer style={{ marginTop: '40px', fontSize: '14px', color: '#777' }}>
        <hr />
        <p>Developed by Redwanul Hoque Chowdhury</p>
      </footer>

    </div>
  );
}

export default AttendanceDownloader;
