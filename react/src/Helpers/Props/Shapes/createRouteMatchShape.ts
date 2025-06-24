import PropTypes from 'prop-types';

// @ts-expect-error TODO: figure out what type props has
function createRouteMatchShape(props) {
    return PropTypes.shape({
        params: PropTypes.shape({
            ...props,
        }).isRequired,
    });
}

export default createRouteMatchShape;
