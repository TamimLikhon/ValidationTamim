const runValidation = (schema, body) => {
    const { error } = schema.validate(body, { abortEarly: false });

    if (error) {
        return new Response(JSON.stringify({
            message: 'Validation error',
            details: error.details.map(err => err.message)
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return null;
};

export default runValidation;
