package lt.povilass.jirap.itunes;

import lt.povilass.jirap.itunes.dto.ITunesArtistsDto;

import java.io.IOException;

public interface ITunesService {
    ITunesArtistsDto getArtistsFromITunes(String searchParam) throws IOException;
}
