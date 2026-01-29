const { serviceSchemas } = require('./validators/schemas');

const mockData = {
    service_date: '2026-01-29',
    service_time: '09:00',
    service_type: 'sunday_service',
    description: '',
    total_attendance: '0' // Request body often has strings
};

const validate = () => {
    console.log("Testing Service Validation...");
    const { error, value } = serviceSchemas.create.validate(mockData, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true
    });

    if (error) {
        console.error("❌ Validation Failed:");
        error.details.forEach(d => console.error(` - ${d.message} (${d.path})`));
    } else {
        console.log("✅ Validation Passed!");
        console.log("Value:", value);
    }

    // Test with number string
    console.log("\nTesting with alternate data...");
    const mockData2 = {
        service_date: '2026-01-29T00:00:00.000Z',
        service_time: '14:30',
        service_type: 'midweek_service'
    };
    const { error: e2 } = serviceSchemas.create.validate(mockData2, { stripUnknown: true, allowUnknown: true });
    if (e2) console.error("❌ Failed 2", e2.message); else console.log("✅ Passed 2");
};

validate();
