package lt.povilass.jirap.itunes.dto;

import java.util.ArrayList;
import java.util.List;

public class ITunesArtistsDto {

    private Integer resultCount;

    private List<ITunesArtistDto> results = new ArrayList<>();

    public Integer getResultCount() {
        return resultCount;
    }

    public ITunesArtistsDto() {

    }

    public void setResultCount(Integer count) {
        this.resultCount = count;
    }

    public List<ITunesArtistDto> getResults() {
        return results;
    }

    public void setResults(List<ITunesArtistDto> iTunesArtists) {
        this.results = iTunesArtists;
    }
}
