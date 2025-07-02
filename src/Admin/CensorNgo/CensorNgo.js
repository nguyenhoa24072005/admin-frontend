import React, { useEffect, useState } from 'react';
import './CensorNgo.css';

const AdminApproval = () => {
    const [ngos, setNgos] = useState([]);
    const [expandedNGO, setExpandedNGO] = useState(null); 
    const [error, setError] = useState(null);
    const [programsByNgo, setProgramsByNgo] = useState({});
    const [account, setAccount] = useState(null);
    const [amount, setAmount] = useState(""); // Define state for amount

    // Fetch account information
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const accountId = 1; // Example, you can get it from session or token
                const response = await fetch(`https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/NGO/account/${accountId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch account information');
                }
                const data = await response.json();
                console.log('Fetched Account:', data);
                setAccount(data); // Set account info in state
            } catch (err) {
                console.error('Error fetching account:', err.message);
                setError('Error fetching account: ' + err.message);
            }
        };

        fetchAccount();
    }, []);

    // Fetch NGOs
    useEffect(() => {
        const fetchNGOs = async () => {
            try {
                const response = await fetch('https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/NGO');
                if (!response.ok) {
                    throw new Error('Failed to fetch NGOs');
                }
                const data = await response.json();
                console.log('Fetched NGOs:', data); // Kiểm tra dữ liệu trả về từ API
                if (data && data.$values) {
                    setNgos(data.$values);
                } else {
                    throw new Error('API response is not in the expected format');
                }
            } catch (err) {
                console.error('Error fetching NGOs:', err.message);
                setError('Error fetching NGOs: ' + err.message);
            }
        };
   
        fetchNGOs();
    }, []);
   

    // Fetch programs for a specific NGO
    const fetchPrograms = async (ngoId) => {
        setProgramsByNgo((prev) => ({
            ...prev,
            [ngoId]: [], // Reset programs for the selected NGO
        }));
        try {
            const response = await fetch(`https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/NGO/${ngoId}/programs`);
            if (!response.ok) {
                throw new Error('Failed to fetch programs');
            }
            const data = await response.json();
            console.log('Fetched Programs for NGO:', data); // Kiểm tra dữ liệu trả về từ API
            if (data && data.$values) {
                setProgramsByNgo((prev) => ({
                    ...prev,
                    [ngoId]: data.$values,
                }));
                setExpandedNGO(ngoId);
            } else {
                throw new Error('API response for programs is not in the expected format');
            }
        } catch (err) {
            console.error('Error fetching programs:', err.message);
            setError('Error fetching programs: ' + err.message);
        }
    };

    // Approve a NGO
    const approveNgo = async (ngoId) => {
        console.log('Approving NGO with ID:', ngoId);
        try {
            const response = await fetch(`https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/ngo/${ngoId}/approval`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${yourToken}`, // Thêm nếu cần
                },
                body: JSON.stringify({ isApproved: true }),
            });
    
            if (!response.ok) {
                // Nếu API trả về lỗi, xử lý lỗi trước khi đọc body
                const errorText = await response.text(); // Đọc nội dung text nếu có
                throw new Error(`Error: ${response.status} - ${errorText || 'Unknown error'}`);
            }
    
            // Kiểm tra nếu response có body
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('API Response:', data);
            } else {
                console.log('No JSON body returned.');
            }
    
            // Xóa NGO đã được duyệt khỏi danh sách
            setNgos((prev) => prev.filter((ngo) => ngo.ngoId !== ngoId));
        } catch (err) {
            console.error('Error approving NGO:', err.message);
            setError('Error approving NGO: ' + err.message);
        }
    };    
    

    // Approve a program
    const approveProgram = async (programId, ngoId) => {
        console.log('Approving Program with ID:', programId); // Kiểm tra ID chương trình đang được duyệt
        try {
            const response = await fetch(`https://charitynavigator-hma3agega6fwfgb2.canadacentral-01.azurewebsites.net/api/Program1/${programId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isApproved: true }),
            });

            if (!response.ok) {
                throw new Error('Failed to approve program');
            }

            setProgramsByNgo((prev) => ({
                ...prev,
                [ngoId]: prev[ngoId].filter((program) => program.ProgramId !== programId),
            }));
        } catch (err) {
            console.error('Error approving program:', err.message);
            setError('Error approving program: ' + err.message);
        }
    };

    return (
        <div className="admin-approval">
            <h1>NGO and Program</h1>
            {error && <p className="error">{error}</p>}
            {account && (
                <div>
                    {/* <h2>Account Role: {account.role}</h2>
                    <h2>NGO ID: {account.NGOId}</h2> */}
                </div>
            )}
            {ngos.length > 0 ? (
                <ul>
                    {ngos.map((ngo) => (
                        <li key={ngo.ngoId}>
                            <div className="ngo-info1">
                                <div className='ngo-src'>
                                    <img src={ngo.logoUrl} alt={`${ngo.name} Logo`} className="ngo-logo1" />
                                </div>
                                <div className='ngo-url1'>
                                    <h3>{ngo.name}</h3>
                                    <p><strong>Description:</strong> {ngo.description}</p>
                                    <p><strong>Code:</strong> {ngo.code}</p>
                                    <p><strong>Achievements:</strong> {ngo.achievements}</p>
                                    <p><strong>Created At:</strong> {new Date(ngo.createdAt).toLocaleDateString()}</p>
                                    <button onClick={() => approveNgo(ngo.ngoId)}>
                                        {ngo.isApproved ? 'Approved' : 'Approve NGO'}
                                    </button>
                                    {expandedNGO !== ngo.ngoId && (
                                        <button onClick={() => fetchPrograms(ngo.ngoId)}>
                                            Show Programs
                                        </button>
                                    )}
                                </div>
                            </div>
                            {programsByNgo[ngo.ngoId] && programsByNgo[ngo.ngoId].length > 0 ? (
                                <div className="program-list1">
                                    <h2>Programs</h2>
                                    <ul>
                                        {programsByNgo[ngo.ngoId].map((program) => {
                                            console.log('Program Data:', program); // Kiểm tra dữ liệu chương trình
                                            const endDate = new Date(program.endDate);
                                            const currentDate = new Date();
                                            const timeDifference = endDate - currentDate;
                                            const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days

                                            // Lấy số tiền đã donate từ totalDonatedAmount (vì donations hiện tại trống)
                                            const donatedAmount = program.totalDonatedAmount || 0;

                                            return (
                                                <li className='censor' key={program.programId}>
                                                    <h5>{program.name}</h5>
                                                    <p><strong>Description:</strong> {program.description}</p>
                                                    <p><strong>Start Date:</strong> {new Date(program.startDate).toLocaleDateString()}</p>
                                                    <p><strong>End Date:</strong> {new Date(program.endDate).toLocaleDateString()}</p>
                                                    <p><strong>Target Amount:</strong> ${program.targetAmount.toFixed(2)}</p>
                                                    <p><strong>Amount Donated:</strong> ${donatedAmount.toFixed(2)}</p> {/* Hiển thị số tiền đã donate */}
                                                    <p><strong>Days Remaining:</strong> {daysRemaining > 0 ? `${daysRemaining} day(s)` : 'Program Ended'}</p>
                                                    <button onClick={() => approveProgram(program.programId, ngo.ngoId)}>
                                                        {program.isApproved ? 'Approved' : 'Approve Program'}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : (
                                <p>No programs available.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No NGOs found.</p>
            )}
        </div>
    );
};

export default AdminApproval;
