const stripe = require('stripe')('secret key')

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
        const { typeName, arguments } = event;

        if (typeName != 'Mutation') {
        throw new Error('Request is not a mutation');
        }

        if (!arguments?.amount) {
            throw new Error('Amount is required');
        }

        //create payment intent 
        const paymentIntent = await stripe.paymentIntents.create({
            amount: argument?.amount,
            currency: 'usd'
        })

        return {
            clientSecret: paymentIntent.clientSecret,
        }
    };
