package lt.povilass.jirap.service;

import lt.povilass.jirap.rest.dto.ArtistsDto;

import java.io.IOException;

public interface ArtistsService {

    ArtistsDto getArtists(String searchParam) throws IOException;
}
