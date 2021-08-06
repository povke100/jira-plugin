package lt.povilass.jirap.itunes.dto;

public class ITunesArtistDto {

    private String wrapperType;
    private String artistType;
    private String artistName;
    private String artistLinkUrl;
    private Long artistId;
    private Long amgArtistId;
    private String primaryGenreName;
    private Long primaryGenreId;

    public ITunesArtistDto() {
    }

    public String getWrapperType() {
        return wrapperType;
    }

    public void setWrapperType(String wrapperType) {
        this.wrapperType = wrapperType;
    }

    public String getArtistType() {
        return artistType;
    }

    public void setArtistType(String artistType) {
        this.artistType = artistType;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getArtistLinkUrl() {
        return artistLinkUrl;
    }

    public void setArtistLinkUrl(String artistLinkUrl) {
        this.artistLinkUrl = artistLinkUrl;
    }

    public Long getArtistId() {
        return artistId;
    }

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
    }

    public Long getAmgArtistId() {
        return amgArtistId;
    }

    public void setAmgArtistId(Long amgArtistId) {
        this.amgArtistId = amgArtistId;
    }

    public String getPrimaryGenreName() {
        return primaryGenreName;
    }

    public void setPrimaryGenreName(String primaryGenreName) {
        this.primaryGenreName = primaryGenreName;
    }

    public Long getPrimaryGenreId() {
        return primaryGenreId;
    }

    public void setPrimaryGenreId(Long primaryGenreId) {
        this.primaryGenreId = primaryGenreId;
    }
}
