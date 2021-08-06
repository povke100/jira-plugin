package lt.povilass.jirap.rest.dto;

import java.util.ArrayList;
import java.util.List;

public class ArtistsDto {

    private List<ArtistDto> artists = new ArrayList<>();

    public List<ArtistDto> getArtists() {
        return artists;
    }

    public void setArtists(List<ArtistDto> artists) {
        this.artists = artists;
    }
}