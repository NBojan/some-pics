const Photo = ({alt_description, likes, urls: {regular}, user: {name, portfolio_url, profile_image: {medium}} }) => {
    return (  
        <div className="photo">
            <a href={regular} className="img d-flex">
                <img src={regular} alt={alt_description} />
            </a>

            <div className="info d-flex space-between align-center">
                <div>
                    <h4 className="col-fff">{name}</h4>
                    <p className="col-fff fs-15">{likes} likes</p>
                </div>
                <a href={portfolio_url} className="thumbImg d-flex">
                    <img src={medium} alt={name} />
                </a>
            </div>
        </div>
    );
}
 
export default Photo;